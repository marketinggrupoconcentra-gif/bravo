import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdminSession } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

// Helper to hash string to SHA-256 (lowercase hex) as required by Google Ads API
function sha256(val: string): string {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// PRIVATE: requires valid admin session (processes lead PII)
export async function POST(req: NextRequest) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { conversionAction, leads = [] } = body;

    // Build Google Ads Offline Conversion Rows
    const conversionRows = leads
      .filter((l: any) => l.attribution?.gclid || l.attribution?.gbraid || l.attribution?.wbraid || l.attribution?.utm_source?.toLowerCase().includes("google"))
      .map((lead: any) => {
        const dateObj = new Date(lead.submittedAt || Date.now());
        const formattedTime = dateObj.toISOString().replace("T", " ").substring(0, 19) + "+00:00";
        
        let estimatedAmount = 0;
        if (lead.monto) {
          const parsed = parseInt(lead.monto.replace(/\\D/g, ""), 10);
          if (!isNaN(parsed)) {
            estimatedAmount = parsed;
          }
        }

        return {
          google_click_id: lead.attribution?.gclid || "",
          conversion_name: conversionAction || "Bravo_Lead_Calificado",
          conversion_date_time: formattedTime,
          conversion_value: estimatedAmount,
          conversion_currency_code: "MXN",
          user_identifiers: [
            { hashed_email: lead.email ? sha256(lead.email) : undefined },
            { hashed_phone: lead.celular ? sha256(`52${lead.celular.replace(/\\D/g, "")}`) : undefined },
          ].filter((u) => u.hashed_email || u.hashed_phone),
          lead_folio: lead.folio,
          lead_name: lead.nombre,
          institution: lead.institucion,
        };
      });

    return NextResponse.json({
      success: true,
      conversions_processed: conversionRows.length,
      rows: conversionRows,
      status: "READY_FOR_UPLOAD",
      message: `Se procesaron ${conversionRows.length} conversiones offline con formato oficial Google Ads Enhanced Conversions API.`,
    });
  } catch (error: any) {
    console.error("[Google Offline Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error al procesar conversiones de Google" },
      { status: 500 }
    );
  }
}
