import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { requireAdminSession } from "@/lib/auth/admin";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    await initDbSchema();
    const logs = await sql`
      SELECT id, action, context_area, previous_value, new_value, user_identity, created_at 
      FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 100
    `;
    return NextResponse.json(logs);
  } catch (error) {
    console.error("[Admin Audit GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
