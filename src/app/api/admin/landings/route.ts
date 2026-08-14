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
    const result = await sql`SELECT * FROM landing_pages ORDER BY updated_at DESC`;
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Landings GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { slug, status, traffic_source, campaign, headline, subheadline, cta_text, form_variant } = data;

    if (!slug) {
      return NextResponse.json({ error: "Invalid payload: slug required" }, { status: 400 });
    }

    await initDbSchema();

    // Log the audit
    const previous = await sql`SELECT * FROM landing_pages WHERE slug = ${slug}`;
    const previousValue = previous.length > 0 ? previous[0] : null;

    await sql`
      INSERT INTO landing_pages (slug, status, traffic_source, campaign, headline, subheadline, cta_text, form_variant, updated_at)
      VALUES (${slug}, ${status}, ${traffic_source}, ${campaign}, ${headline}, ${subheadline}, ${cta_text}, ${form_variant}, NOW())
      ON CONFLICT (slug) DO UPDATE SET 
        status = EXCLUDED.status,
        traffic_source = EXCLUDED.traffic_source,
        campaign = EXCLUDED.campaign,
        headline = EXCLUDED.headline,
        subheadline = EXCLUDED.subheadline,
        cta_text = EXCLUDED.cta_text,
        form_variant = EXCLUDED.form_variant,
        updated_at = NOW()
    `;

    // Write audit log
    await sql`
      INSERT INTO audit_logs (action, context_area, previous_value, new_value, user_identity)
      VALUES (
        'UPDATE_LANDING_PAGE',
        ${slug},
        ${previousValue ? JSON.stringify(previousValue) : null}::jsonb,
        ${JSON.stringify(data)}::jsonb,
        'Administrador del Sistema'
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Landings POST Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Invalid payload: slug required" }, { status: 400 });
    }

    await initDbSchema();
    await sql`DELETE FROM landing_pages WHERE slug = ${slug}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Landings DELETE Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
