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

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  try {
    await initDbSchema();

    if (key) {
      const result = await sql`SELECT value FROM admin_config WHERE key = ${key}`;
      if (result.length > 0) {
        return NextResponse.json(result[0].value);
      }
      return NextResponse.json(null);
    } else {
      const result = await sql`SELECT key, value FROM admin_config`;
      const configMap = result.reduce((acc: any, row: any) => {
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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await initDbSchema();

    // Log the audit
    const previous = await sql`SELECT value FROM admin_config WHERE key = ${key}`;
    const previousValue = previous.length > 0 ? previous[0].value : null;

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
        'Administrador del Sistema'
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Config POST Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
