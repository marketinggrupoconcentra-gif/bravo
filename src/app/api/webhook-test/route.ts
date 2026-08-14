import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpointUrl, method = "POST", headers = {}, payload = {} } = body;

    if (!endpointUrl || !endpointUrl.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "URL del webhook inválida. Debe comenzar con https:// o http://" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let responseStatus = 0;
    let responseBody = "";

    try {
      const externalRes = await fetch(endpointUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Bravo-Mexico-Lead-Forwarder/1.0",
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      responseStatus = externalRes.status;
      responseBody = (await externalRes.text()).slice(0, 1000);
    } catch (fetchErr: any) {
      return NextResponse.json({
        success: false,
        error: `Error de conexión con el endpoint externo: ${fetchErr?.message || "Timeout / Red no disponible"}`,
        durationMs: Date.now() - startTime,
      });
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: responseStatus >= 200 && responseStatus < 300,
      status: responseStatus,
      durationMs,
      responsePreview: responseBody || "(Respuesta vacía)",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Error procesando test de webhook" },
      { status: 500 }
    );
  }
}
