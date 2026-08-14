import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side allowlist of integration test endpoints.
// The browser sends an integrationId — never a raw URL.
const INTEGRATION_ENDPOINTS: Record<string, string> = {
  meta_capi: "https://graph.facebook.com/v19.0",
  google_offline: "https://googleads.googleapis.com",
  intelix: process.env.INTELIX_BASE_URL || "https://api.intelix.mx",
};

export async function POST(req: NextRequest) {
  // Auth is enforced by middleware for /api/admin/* routes,
  // but we also validate here for defense-in-depth.
  const adminToken = req.cookies.get("bravo_admin_token")?.value;
  if (!adminToken || adminToken !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { integrationId } = body;

    if (!integrationId || typeof integrationId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error:
            "integrationId is required. Provide a known integration ID (meta_capi, google_offline, intelix).",
        },
        { status: 400 }
      );
    }

    const targetBase = INTEGRATION_ENDPOINTS[integrationId];
    if (!targetBase) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown integrationId: "${integrationId}". Allowed: ${Object.keys(INTEGRATION_ENDPOINTS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Ping the known endpoint root — this confirms DNS/connectivity only, not a real API call
    const startTime = Date.now();
    let responseStatus = 0;

    try {
      const probeRes = await fetch(targetBase, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });
      responseStatus = probeRes.status;
    } catch {
      return NextResponse.json({
        success: false,
        integrationId,
        error: `Could not reach ${integrationId} endpoint. Network unavailable or timeout.`,
        durationMs: Date.now() - startTime,
      });
    }

    return NextResponse.json({
      success: responseStatus >= 200 && responseStatus < 500,
      integrationId,
      endpoint: targetBase,
      status: responseStatus,
      durationMs: Date.now() - startTime,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Error processing integration test" },
      { status: 500 }
    );
  }
}
