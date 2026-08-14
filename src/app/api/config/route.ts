import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";

const PUBLIC_KEYS = ["contact_channels"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key || !PUBLIC_KEYS.includes(key)) {
    return NextResponse.json({ error: "Forbidden or invalid key" }, { status: 403 });
  }

  try {
    await initDbSchema();
    const result = await sql`SELECT value FROM admin_config WHERE key = ${key}`;
    if (result.length > 0) {
      return NextResponse.json({ success: true, data: result[0].value });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("[Public Config GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
