import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdminSession } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

// Helper to hash string to SHA-256 (lowercase hex) as required by Meta CAPI
function sha256(val: string): string {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// Clean phone for Meta CAPI (E.164 without +, e.g. 525512345678)
function formatMetaPhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

// PRIVATE: requires valid admin session (sends lead PII to Meta CAPI)
export async function POST(req: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      pixelId,
      accessToken,
      testEventCode,
      eventName = "Lead",
      lead,
      value = 75000,
      currency = "MXN",
    } = body;

    if (!pixelId) {
      return NextResponse.json(
        { success: false, error: "Pixel ID de Meta es requerido." },
        { status: 400 }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const clientUserAgent =
      lead?.attribution?.last_touch?.user_agent ||
      lead?.attribution?.first_touch?.user_agent ||
      req.headers.get("user-agent") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

    const unixTime = Math.floor(Date.now() / 1000);

    let parsedValue = 0;
    if (lead?.monto) {
      const parsed = parseInt(lead.monto.replace(/\\D/g, ""), 10);
      if (!isNaN(parsed)) parsedValue = parsed;
    }

    // Build standard Meta CAPI event payload
    const eventPayload: Record<string, unknown> = {
      event_name: eventName,
      event_time: unixTime,
      event_id: lead?.folio || `BR-${unixTime}`,
      event_source_url: `https://bravo.mx/gracias?folio=${lead?.folio || "lead"}`,
      action_source: "website",
      user_data: {
        em: lead?.email ? [sha256(lead.email)] : [],
        ph: lead?.celular ? [sha256(formatMetaPhone(lead.celular))] : [],
        fn: lead?.nombre ? [sha256(lead.nombre.split(" ")[0])] : [],
        ln: lead?.nombre ? [sha256(lead.nombre.split(" ").slice(1).join(" ") || lead.nombre)] : [],
        client_ip_address: clientIp,
        client_user_agent: clientUserAgent,
        fbc: lead?.attribution?.fbc || (lead?.attribution?.fbclid ? `fb.1.${Date.now()}.${lead.attribution.fbclid}` : undefined),
        fbp: lead?.attribution?.fbp || undefined,
        external_id: lead?.folio ? [sha256(lead.folio)] : undefined,
      },
      custom_data: {
        currency: currency,
        value: Number(value) || parsedValue,
        content_name: `Programa Liquidación Bravo - ${lead?.institucion || "Deuda Bancaria"}`,
        content_category: "Servicios Financieros",
        lead_status: lead?.status || "Nuevo",
      },
    };

    // Remove undefined values
    const cleanedUserData = Object.fromEntries(
      Object.entries(eventPayload.user_data as Record<string, unknown>).filter(
        ([_, v]) => v !== undefined && (!Array.isArray(v) || v.length > 0)
      )
    );
    eventPayload.user_data = cleanedUserData;

    const requestBody: Record<string, unknown> = {
      data: [eventPayload],
    };

    if (testEventCode) {
      requestBody.test_event_code = testEventCode;
    }

    // If an Access Token is provided, execute real Meta Graph API call
    if (accessToken) {
      const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      const metaRes = await fetch(metaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const metaData = await metaRes.json();
      return NextResponse.json({
        success: metaRes.ok,
        status: metaRes.status,
        meta_response: metaData,
        dispatched_payload: requestBody,
        is_live_call: true,
      });
    }

    // Otherwise, return NOT_CONFIGURED
    return NextResponse.json(
      { 
        success: false, 
        error: "NOT_CONFIGURED",
        is_live_call: false,
        note: "Meta Access Token no configurado."
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Meta CAPI API Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error al procesar Meta CAPI" },
      { status: 500 }
    );
  }
}
