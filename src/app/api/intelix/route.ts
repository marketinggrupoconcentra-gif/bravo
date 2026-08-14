import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

/**
 * POST /api/intelix
 *
 * Envía un lead al CRM de Intelix.
 * Si INTELIX_API_KEY está configurada, hace la llamada real.
 * Si no, devuelve una respuesta simulada para desarrollo/staging.
 *
 * El resultado se guarda en api_sync_logs.intelix de la tabla leads.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      folio,
      nombre,
      celular,
      email,
      institucion,
      monto,
      tipoDeuda,
      device,
      referrer,
      attribution,
    } = body;

    if (!folio || !nombre || !celular) {
      return NextResponse.json(
        { success: false, error: "Campos requeridos: folio, nombre, celular" },
        { status: 400 }
      );
    }

    const apiKey = process.env.INTELIX_API_KEY;
    const baseUrl = process.env.INTELIX_BASE_URL || "https://api.intelix.mx";
    const sentAt = new Date().toISOString();

    let intelixLog: Record<string, unknown>;

    if (apiKey) {
      // ── Llamada real a Intelix CRM ──────────────────────────────
      try {
        const payload = {
          external_id: folio,
          nombre_completo: nombre,
          telefono: celular,
          correo: email || "",
          institucion_financiera: institucion || "No especificada",
          monto_deuda: monto || "No especificado",
          tipo_deuda: tipoDeuda || "Tarjeta de crédito",
          dispositivo: device || "Escritorio",
          referrer: referrer || "Directo",
          fuente: attribution?.utm_source || "bravo-web",
          medio: attribution?.utm_medium || "organic",
          campana: attribution?.utm_campaign || "",
          gclid: attribution?.gclid || "",
          fbclid: attribution?.fbclid || "",
          fecha_registro: sentAt,
        };

        const intelixRes = await fetch(`${baseUrl}/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-Source": "bravo-mexico-web",
            "User-Agent": "BravoMexico-CAPI/2.0",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8000), // 8s timeout
        });

        const responseText = await intelixRes.text();
        let responseData: Record<string, unknown> = {};
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = { raw: responseText.slice(0, 200) };
        }

        if (intelixRes.ok) {
          intelixLog = {
            status: "success",
            sentAt,
            responseCode: intelixRes.status,
            responseMessage: `Lead registrado en Intelix CRM (HTTP ${intelixRes.status}).`,
            lead_id: responseData.id || responseData.lead_id || responseData.folio || null,
            details: {
              endpoint: `${baseUrl}/v1/leads`,
              is_live_call: true,
              duration_ms: Date.now() - startTime,
              response_snippet: responseText.slice(0, 300),
            },
          };
        } else {
          intelixLog = {
            status: "failed",
            sentAt,
            responseCode: intelixRes.status,
            responseMessage: `Error en Intelix CRM (HTTP ${intelixRes.status}): ${responseText.slice(0, 200)}`,
            details: {
              endpoint: `${baseUrl}/v1/leads`,
              is_live_call: true,
              duration_ms: Date.now() - startTime,
            },
          };
        }
      } catch (fetchErr: any) {
        intelixLog = {
          status: "failed",
          sentAt,
          responseCode: 0,
          responseMessage: `Error de conexión con Intelix (${fetchErr?.name || "Error"}): ${fetchErr?.message || "Sin respuesta del servidor"}`,
          details: {
            endpoint: `${baseUrl}/v1/leads`,
            is_live_call: true,
            duration_ms: Date.now() - startTime,
          },
        };
      }
    } else {
      // ── Modo simulado (sin INTELIX_API_KEY) ─────────────────────
      intelixLog = {
        status: "sandbox",
        sentAt,
        responseCode: 200,
        responseMessage:
          "Modo sandbox: lead validado y formateado para Intelix CRM. Configura INTELIX_API_KEY en .env.local para envíos reales.",
        lead_id: `INTELIX-SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        details: {
          is_live_call: false,
          simulation_note: "Variable INTELIX_API_KEY no configurada en el entorno.",
        },
      };
    }

    // ── Actualizar api_sync_logs en Neon DB ─────────────────────
    try {
      await sql`
        UPDATE leads
        SET api_sync_logs = api_sync_logs || ${JSON.stringify({ intelix: intelixLog })}::jsonb
        WHERE folio = ${folio};
      `;
    } catch (dbErr: any) {
      console.warn("[Intelix] No se pudo actualizar api_sync_logs en Neon:", dbErr?.message);
    }

    return NextResponse.json({
      success: intelixLog.status === "success" || intelixLog.status === "sandbox",
      intelix: intelixLog,
    });
  } catch (error: any) {
    console.error("[POST /api/intelix Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error interno en endpoint Intelix" },
      { status: 500 }
    );
  }
}
