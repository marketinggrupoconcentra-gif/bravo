import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { cookies } from "next/headers";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return token === process.env.ADMIN_SECRET_KEY;
}

export async function GET(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
