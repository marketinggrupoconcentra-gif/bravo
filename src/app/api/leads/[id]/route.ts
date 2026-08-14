import { NextRequest, NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { requireAdminSession } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

// PATCH: Update lead status — PRIVATE: requires valid admin session
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    await initDbSchema();
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status field is required" },
        { status: 400 }
      );
    }

    const updated = await sql`
      UPDATE leads
      SET status = ${status}
      WHERE id = ${parseInt(id, 10)} OR folio = ${id}
      RETURNING id::text, folio, status;
    `;

    return NextResponse.json({ success: true, updated: updated[0] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update lead";
    console.error("[PATCH /api/leads/[id] Error]", error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
