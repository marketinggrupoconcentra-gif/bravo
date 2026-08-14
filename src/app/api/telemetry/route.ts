import { NextRequest, NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

// GET: Fetch recent analytics events from Neon Postgres
export async function GET(req: NextRequest) {
  try {
    await initDbSchema();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, parseInt(searchParams.get("limit") || "100", 10));

    const rows = await sql`
      SELECT 
        id::text,
        event_name AS event,
        page_path,
        page_title,
        details,
        device,
        created_at AS timestamp
      FROM analytics_events
      ORDER BY created_at DESC
      LIMIT ${limit};
    `;

    return NextResponse.json({ success: true, events: rows });
  } catch (error: any) {
    console.error("[GET /api/telemetry Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}

// POST: Insert a new analytics event into Neon Postgres
export async function POST(req: NextRequest) {
  try {
    await initDbSchema();

    const body = await req.json();
    const { event, page_path, page_title, details, device } = body;

    if (!event || !page_path) {
      return NextResponse.json(
        { success: false, error: "Missing event or page_path" },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO analytics_events (
        event_name,
        page_path,
        page_title,
        details,
        device
      )
      VALUES (
        ${event},
        ${page_path},
        ${page_title || "Bravo México"},
        ${JSON.stringify(details || {})},
        ${device || "Escritorio"}
      )
      RETURNING id::text, event_name AS event, created_at AS timestamp;
    `;

    return NextResponse.json({ success: true, logged: inserted[0] });
  } catch (error: any) {
    console.error("[POST /api/telemetry Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save telemetry event" },
      { status: 500 }
    );
  }
}
