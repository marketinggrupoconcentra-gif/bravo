import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Initialize schema if not exists
    await initDbSchema();

    // 2. Query Postgres version & table count
    const versionResult = await sql`SELECT version();`;
    const leadsCount = await sql`SELECT count(*)::int AS count FROM leads;`;
    const eventsCount = await sql`SELECT count(*)::int AS count FROM analytics_events;`;

    return NextResponse.json({
      success: true,
      status: "connected",
      neon_postgres_version: versionResult[0]?.version || "Connected",
      stats: {
        total_leads_in_db: leadsCount[0]?.count || 0,
        total_events_in_db: eventsCount[0]?.count || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Neon Check Error]", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: error?.message || "Unknown error connecting to Neon",
      },
      { status: 500 }
    );
  }
}
