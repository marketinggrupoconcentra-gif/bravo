import { neon, neonConfig } from "@neondatabase/serverless";

// Optional configuration
neonConfig.fetchConnectionCache = true;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_bBGYmj0w8qsU@ep-shy-wildflower-aw8lm8ot-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const sql = neon(connectionString);

let schemaInitialized = false;

// Auto-initialize schema in Neon
export async function initDbSchema() {
  if (schemaInitialized) return;

  try {
    // 1. Create leads table
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        folio VARCHAR(32) UNIQUE NOT NULL,
        nombre VARCHAR(128) NOT NULL,
        institucion VARCHAR(128) NOT NULL,
        tipo_deuda VARCHAR(128) NOT NULL,
        monto VARCHAR(128) NOT NULL,
        celular VARCHAR(32) NOT NULL,
        email VARCHAR(128),
        status VARCHAR(64) DEFAULT 'Nuevo',
        device VARCHAR(64),
        referrer TEXT,
        attribution JSONB DEFAULT '{}'::jsonb,
        notes TEXT DEFAULT '',
        api_sync_logs JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Ensure columns exist on already created tables
    try {
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS attribution JSONB DEFAULT '{}'::jsonb;`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS api_sync_logs JSONB DEFAULT '{}'::jsonb;`;
    } catch {}

    // 2. Create analytics events table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_name VARCHAR(128) NOT NULL,
        page_path VARCHAR(256) NOT NULL,
        page_title VARCHAR(256),
        details JSONB,
        device VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 3. Create cms_content table for real-time landing page editing
    await sql`
      CREATE TABLE IF NOT EXISTS cms_content (
        id VARCHAR(64) PRIMARY KEY,
        page_slug VARCHAR(64) NOT NULL,
        section_id VARCHAR(64) NOT NULL,
        title TEXT,
        subtitle TEXT,
        badge TEXT,
        description TEXT,
        primary_cta_text TEXT,
        primary_cta_url TEXT,
        secondary_cta_text TEXT,
        secondary_cta_url TEXT,
        background_style VARCHAR(64) DEFAULT 'default',
        theme_mode VARCHAR(32) DEFAULT 'light',
        custom_config JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 4. Create index for fast retrieval
    await sql`
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cms_page_slug ON cms_content (page_slug, section_id);
    `;

    schemaInitialized = true;
  } catch (error) {
    console.error("[Neon DB] Error initializing tables:", error);
    throw error;
  }
}
