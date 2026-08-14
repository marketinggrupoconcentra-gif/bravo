import { NextRequest, NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import crypto from "crypto";
import { requireAdminSession } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

function sha256(val: string): string {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

function formatMetaPhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

async function checkGlobalRateLimit(ip: string): Promise<boolean> {
  try {
    const limitWindowMs = 60 * 1000; // 1 minute
    const maxRequests = 5;
    
    // Cleanup old records occasionally (1% chance)
    if (Math.random() < 0.01) {
      await sql`DELETE FROM rate_limits WHERE expires_at < NOW()`;
    }

    const rows = await sql`
      INSERT INTO rate_limits (ip, count, expires_at)
      VALUES (${ip}, 1, NOW() + (${limitWindowMs} || ' milliseconds')::interval)
      ON CONFLICT (ip) DO UPDATE SET 
        count = CASE 
          WHEN rate_limits.expires_at < NOW() THEN 1 
          ELSE rate_limits.count + 1 
        END,
        expires_at = CASE 
          WHEN rate_limits.expires_at < NOW() THEN NOW() + (${limitWindowMs} || ' milliseconds')::interval 
          ELSE rate_limits.expires_at 
        END
      RETURNING count;
    `;

    const count = rows[0]?.count || 1;
    return count <= maxRequests;
  } catch (error) {
    console.error("[Rate Limit Error]", error);
    return true; // Fail open if DB is down
  }
}

// GET: Fetch all leads from Neon Postgres with api_sync_logs
// PRIVATE: requires valid admin session
export async function GET(req: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    await initDbSchema();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, parseInt(searchParams.get("limit") || "100", 10));

    const rows = await sql`
      SELECT 
        id::text,
        folio,
        nombre,
        institucion,
        tipo_deuda AS "tipoDeuda",
        monto,
        celular,
        email,
        status,
        device,
        referrer,
        COALESCE(attribution, '{}'::jsonb) AS attribution,
        COALESCE(notes, '') AS notes,
        COALESCE(api_sync_logs, '{}'::jsonb) AS "api_sync_logs",
        created_at AS "submittedAt"
      FROM leads
      ORDER BY created_at DESC
      LIMIT ${limit};
    `;

    return NextResponse.json({ success: true, leads: rows });
  } catch (error: any) {
    console.error("[GET /api/leads Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST: Insert a new lead and execute platform dispatches
export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    await initDbSchema();

    const isAllowed = await checkGlobalRateLimit(clientIp);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // ── Payload size guard (max 32KB) ─────────────────────────────────────
    const contentLength = Number(req.headers.get("content-length") || "0");
    if (contentLength > 32_768) {
      return NextResponse.json(
        { success: false, error: "Payload too large" },
        { status: 413 }
      );
    }


    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // ── Explicit field whitelist — no arbitrary browser fields accepted ────
    const {
      nombre,
      institucion,
      tipoDeuda,
      monto,
      celular,
      email,
      device,
      referrer,
      attribution,
      // webhookConfig intentionally excluded (SSRF / open redirect risk)
    } = body as {
      nombre?: string;
      institucion?: string;
      tipoDeuda?: string;
      monto?: string;
      celular?: string;
      email?: string;
      device?: string;
      referrer?: string;
      attribution?: Record<string, unknown>;
    };

    // ── Required field presence ────────────────────────────────────────────
    if (!nombre || !celular) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: nombre, celular" },
        { status: 400 }
      );
    }

    // ── Type enforcement ───────────────────────────────────────────────────
    if (
      typeof nombre !== "string" ||
      typeof celular !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid field types" },
        { status: 400 }
      );
    }

    // ── Field length limits ────────────────────────────────────────────────
    if (nombre.length > 120) {
      return NextResponse.json(
        { success: false, error: "Field length exceeded" },
        { status: 400 }
      );
    }

    // ── Generate authoritative folio (server-side) ─────────────────────────
    const serverFolio = `BR-${crypto.randomUUID().toUpperCase()}`;

    // ── Phone normalization and format check ───────────────────────────────
    const celularDigits = celular.replace(/\D/g, "");
    if (celularDigits.length < 10 || celularDigits.length > 13) {
      return NextResponse.json(
        { success: false, error: "Número de celular inválido (se esperan 10 dígitos)" },
        { status: 400 }
      );
    }
    const celularNormalized = celularDigits;

    // ── Email format check (if provided) ──────────────────────────────────
    const emailNormalized = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (emailNormalized && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized)) {
      return NextResponse.json(
        { success: false, error: "Formato de correo inválido" },
        { status: 400 }
      );
    }

    // ── Phone normalization and format check ───────────────────────────────

    // ── Nombre normalization ────────────────────────────────────────────────
    const nombreNormalized = nombre.trim().slice(0, 120);

    const nowIso = new Date().toISOString();

    // =========================================================================
    // 1. Meta Conversions API (CAPI)
    // =========================================================================
    // STATUS: NOT_CONFIGURED
    // Real CAPI implementation requires Meta Pixel ID + CAPI Token server-side.
    // Until those are configured and the real fetch is implemented, we report
    // NOT_CONFIGURED — we never mark success without a real provider response.
    //
    // To implement: add META_PIXEL_ID + META_CAPI_TOKEN to env and make
    // a real POST to https://graph.facebook.com/v19.0/{pixelId}/events
    const hasMetaConfig = Boolean(
      process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN
    );
    const metaCapiLog: Record<string, unknown> = hasMetaConfig
      ? {
          status: "PENDING",
          sentAt: nowIso,
          responseMessage: "Meta CAPI credentials detected but real implementation not yet wired.",
        }
      : {
          status: "NOT_CONFIGURED",
          sentAt: nowIso,
          responseMessage: "META_PIXEL_ID and META_CAPI_TOKEN are not configured. Set them in environment variables to enable Meta CAPI.",
        };

    // =========================================================================
    // 2. Google Ads Enhanced Conversions
    // =========================================================================
    // STATUS: NOT_CONFIGURED
    // Real Google Ads Enhanced Conversions requires Conversion ID + label.
    // Until those are configured and the real fetch is implemented, NOT_CONFIGURED.
    //
    // To implement: add GOOGLE_ADS_CONVERSION_ID + GOOGLE_ADS_LABEL to env
    // and send via Google Ads Measurement Protocol or gtag server-side.
    const hasGoogleConfig = Boolean(
      process.env.GOOGLE_ADS_CONVERSION_ID && process.env.GOOGLE_ADS_LABEL
    );
    const googleAdsLog: Record<string, unknown> = hasGoogleConfig
      ? {
          status: "PENDING",
          sentAt: nowIso,
          responseMessage: "Google Ads credentials detected but real implementation not yet wired.",
        }
      : {
          status: "NOT_CONFIGURED",
          sentAt: nowIso,
          responseMessage: "GOOGLE_ADS_CONVERSION_ID and GOOGLE_ADS_LABEL are not configured. Set them in environment variables to enable Google Enhanced Conversions.",
        };


    // =========================================================================
    // 3. Autonomous Intelix CRM Dispatch
    // =========================================================================
    let crmWebhookLog: Record<string, unknown> = {
      status: "sandbox",
      responseMessage: "Modo sandbox: lead validado, pero INTELIX_API_KEY no configurado.",
    };

    const intelixApiKey = process.env.INTELIX_API_KEY;
    const intelixBaseUrl = process.env.INTELIX_BASE_URL || "https://api.intelix.mx";

    if (intelixApiKey) {
      try {
        const payload = {
          external_id: serverFolio,
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
          fecha_registro: nowIso,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s limit

        const webhookRes = await fetch(`${intelixBaseUrl}/v1/leads`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${intelixApiKey}`,
            "X-Source": "bravo-mexico-web",
            "User-Agent": "Bravo-Mexico-Autonomous/2.0",
          },
          body: JSON.stringify(payload),
        });
        clearTimeout(timeoutId);

        const statusText = await webhookRes.text().catch(() => "");
        
        if (webhookRes.ok) {
          crmWebhookLog = {
            status: "success",
            sentAt: new Date().toISOString(),
            responseCode: webhookRes.status,
            responseMessage: `Lead registrado en Intelix CRM (HTTP ${webhookRes.status}).`,
            details: {
              endpoint: `${intelixBaseUrl}/v1/leads`,
              response_snippet: statusText.slice(0, 120),
            },
          };
        } else {
          crmWebhookLog = {
            status: "failed",
            sentAt: new Date().toISOString(),
            responseCode: webhookRes.status,
            responseMessage: `Error en Intelix CRM (HTTP ${webhookRes.status}): ${statusText.slice(0, 180)}`,
            details: {
              endpoint: `${intelixBaseUrl}/v1/leads`,
            },
          };
        }
      } catch (err: any) {
        crmWebhookLog = {
          status: "failed",
          sentAt: new Date().toISOString(),
          responseCode: 0,
          responseMessage: `Fallo de conexión al CRM: ${err?.message || "Timeout o error de red."}`,
        };
      }
    }

    const apiSyncLogs = {
      meta_capi: metaCapiLog,
      google_ads: googleAdsLog,
      crm_webhook: crmWebhookLog,
      intelix: {
        status: "pending",
        responseMessage: "Sincronización con Intelix CRM iniciada…",
        sentAt: nowIso,
      },
    };

    const attributionJson = JSON.stringify(attribution || {});
    const apiSyncLogsJson = JSON.stringify(apiSyncLogs);

    const inserted = await sql`
      INSERT INTO leads (
        folio,
        nombre,
        institucion,
        tipo_deuda,
        monto,
        celular,
        email,
        device,
        referrer,
        attribution,
        api_sync_logs
      )
      VALUES (
        ${serverFolio},
        ${nombreNormalized},
        ${typeof institucion === "string" ? institucion.slice(0, 200) : "Institución bancaria"},
        ${typeof tipoDeuda === "string" ? tipoDeuda.slice(0, 100) : "Tarjeta de crédito"},
        ${typeof monto === "string" ? monto.slice(0, 100) : "Más de $50,000 MXN"},
        ${celularNormalized},
        ${emailNormalized},
        ${typeof device === "string" ? device.slice(0, 100) : "Escritorio"},
        ${typeof referrer === "string" ? referrer.slice(0, 500) : "Directo"},
        ${attributionJson}::jsonb,
        ${apiSyncLogsJson}::jsonb
      )
      RETURNING 
        id::text,
        folio,
        nombre,
        institucion,
        tipo_deuda AS "tipoDeuda",
        monto,
        celular,
        email,
        status,
        device,
        referrer,
        COALESCE(attribution, '{}'::jsonb) AS attribution,
        COALESCE(notes, '') AS notes,
        COALESCE(api_sync_logs, '{}'::jsonb) AS "api_sync_logs",
        created_at AS "submittedAt";
    `;

    const savedLead = (inserted as any[])[0];

    // Redirect is always an internal approved route — never a browser-supplied URL
    const redirectUrl = `/gracias`;

    return NextResponse.json({
      success: true,
      lead: savedLead,
      api_sync_logs: apiSyncLogs,
      redirectUrl,
    });
  } catch (error: any) {
    console.error("[POST /api/leads Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save lead in Neon" },
      { status: 500 }
    );
  }
}
