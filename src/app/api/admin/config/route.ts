import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { requireAdminSession, getAdminIdentityLabel } from "@/lib/auth/admin";

export async function GET(req: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  try {
    await initDbSchema();

    if (key) {
      const result = await sql`SELECT value FROM admin_config WHERE key = ${key}`;
      if ((result as any[]).length > 0) {
        return NextResponse.json((result as any[])[0].value);
      }
      return NextResponse.json(null);
    } else {
      const result = await sql`SELECT key, value FROM admin_config`;
      const configMap = (result as any[]).reduce((acc: any, row: any) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
      return NextResponse.json(configMap);
    }
  } catch (error) {
    console.error("[Admin Config GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await initDbSchema();

    // Fetch previous for audit
    const previous = await sql`SELECT value FROM admin_config WHERE key = ${key}`;
    const previousValue = (previous as any[]).length > 0 ? (previous as any[])[0].value : null;

    await sql`
      INSERT INTO admin_config (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;

    // Write audit log
    await sql`
      INSERT INTO audit_logs (action, context_area, previous_value, new_value, user_identity)
      VALUES (
        'UPDATE_CONFIG',
        ${key},
        ${previousValue ? JSON.stringify(previousValue) : null}::jsonb,
        ${JSON.stringify(value)}::jsonb,
        ${getAdminIdentityLabel()}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Config POST Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
