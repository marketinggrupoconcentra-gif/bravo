import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set in environment variables.");
}

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
        status VARCHAR(32) DEFAULT 'PUBLISHED',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    try {
      await sql`ALTER TABLE cms_content ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'PUBLISHED';`;
    } catch {}

    // 4. Create admin configuration and compliance tables
    await sql`
      CREATE TABLE IF NOT EXISTS claims_registry (
        id VARCHAR(128) PRIMARY KEY,
        label VARCHAR(256) NOT NULL,
        value TEXT NOT NULL,
        status VARCHAR(64) DEFAULT 'PENDING_VALIDATION',
        source VARCHAR(256),
        source_date DATE,
        legal_approved BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_config (
        key VARCHAR(128) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(128) NOT NULL,
        context_area VARCHAR(128) NOT NULL,
        previous_value JSONB,
        new_value JSONB,
        user_identity VARCHAR(128) DEFAULT 'System',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS landing_pages (
        slug VARCHAR(128) PRIMARY KEY,
        status VARCHAR(64) DEFAULT 'DRAFT',
        traffic_source VARCHAR(64),
        campaign VARCHAR(128),
        headline TEXT,
        subheadline TEXT,
        cta_text VARCHAR(128),
        form_variant VARCHAR(64),
        published_version INT DEFAULT 1,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 5. Create index for fast retrieval
    await sql`
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cms_page_slug ON cms_content (page_slug, section_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
    `;

    schemaInitialized = true;
  } catch (error) {
    console.error("[Neon DB] Error initializing tables:", error);
    throw error;
  }
}
