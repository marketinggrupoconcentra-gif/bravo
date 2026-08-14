import { NextRequest, NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

// GET: Fetch CMS content from Neon Postgres
export async function GET(req: NextRequest) {
  try {
    await initDbSchema();

    const { searchParams } = new URL(req.url);
    const pageSlug = searchParams.get("page_slug");

    let rows;
    if (pageSlug) {
      rows = await sql`
        SELECT 
          id,
          page_slug AS "pageSlug",
          section_id AS "sectionId",
          title,
          subtitle,
          badge,
          description,
          primary_cta_text AS "primaryCtaText",
          primary_cta_url AS "primaryCtaUrl",
          secondary_cta_text AS "secondaryCtaText",
          secondary_cta_url AS "secondaryCtaUrl",
          background_style AS "backgroundStyle",
          theme_mode AS "themeMode",
          custom_config AS "customConfig",
          updated_at AS "updatedAt"
        FROM cms_content
        WHERE page_slug = ${pageSlug}
        ORDER BY section_id ASC;
      `;
    } else {
      rows = await sql`
        SELECT 
          id,
          page_slug AS "pageSlug",
          section_id AS "sectionId",
          title,
          subtitle,
          badge,
          description,
          primary_cta_text AS "primaryCtaText",
          primary_cta_url AS "primaryCtaUrl",
          secondary_cta_text AS "secondaryCtaText",
          secondary_cta_url AS "secondaryCtaUrl",
          background_style AS "backgroundStyle",
          theme_mode AS "themeMode",
          custom_config AS "customConfig",
          updated_at AS "updatedAt"
        FROM cms_content
        ORDER BY page_slug ASC, section_id ASC;
      `;
    }

    return NextResponse.json({ success: true, items: rows });
  } catch (error: any) {
    console.error("[GET /api/cms Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch CMS content" },
      { status: 500 }
    );
  }
}

// POST: Save/Upsert CMS section content in Neon Postgres
export async function POST(req: NextRequest) {
  try {
    await initDbSchema();

    const body = await req.json();
    const {
      pageSlug,
      sectionId,
      title,
      subtitle,
      badge,
      description,
      primaryCtaText,
      primaryCtaUrl,
      secondaryCtaText,
      secondaryCtaUrl,
      backgroundStyle,
      themeMode,
      customConfig,
    } = body;

    if (!pageSlug || !sectionId) {
      return NextResponse.json(
        { success: false, error: "pageSlug and sectionId are required" },
        { status: 400 }
      );
    }

    const id = `${pageSlug}_${sectionId}`.toLowerCase();

    const upserted = await sql`
      INSERT INTO cms_content (
        id,
        page_slug,
        section_id,
        title,
        subtitle,
        badge,
        description,
        primary_cta_text,
        primary_cta_url,
        secondary_cta_text,
        secondary_cta_url,
        background_style,
        theme_mode,
        custom_config,
        updated_at
      )
      VALUES (
        ${id},
        ${pageSlug},
        ${sectionId},
        ${title || ""},
        ${subtitle || ""},
        ${badge || ""},
        ${description || ""},
        ${primaryCtaText || ""},
        ${primaryCtaUrl || ""},
        ${secondaryCtaText || ""},
        ${secondaryCtaUrl || ""},
        ${backgroundStyle || "default"},
        ${themeMode || "light"},
        ${JSON.stringify(customConfig || {})},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        badge = EXCLUDED.badge,
        description = EXCLUDED.description,
        primary_cta_text = EXCLUDED.primary_cta_text,
        primary_cta_url = EXCLUDED.primary_cta_url,
        secondary_cta_text = EXCLUDED.secondary_cta_text,
        secondary_cta_url = EXCLUDED.secondary_cta_url,
        background_style = EXCLUDED.background_style,
        theme_mode = EXCLUDED.theme_mode,
        custom_config = EXCLUDED.custom_config,
        updated_at = NOW()
      RETURNING 
        id,
        page_slug AS "pageSlug",
        section_id AS "sectionId",
        title,
        subtitle,
        badge,
        description,
        primary_cta_text AS "primaryCtaText",
        primary_cta_url AS "primaryCtaUrl",
        secondary_cta_text AS "secondaryCtaText",
        secondary_cta_url AS "secondaryCtaUrl",
        background_style AS "backgroundStyle",
        theme_mode AS "themeMode",
        custom_config AS "customConfig",
        updated_at AS "updatedAt";
    `;

    return NextResponse.json({ success: true, item: upserted[0] });
  } catch (error: any) {
    console.error("[POST /api/cms Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save CMS content" },
      { status: 500 }
    );
  }
}
