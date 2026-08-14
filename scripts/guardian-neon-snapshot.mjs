#!/usr/bin/env node

import { neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(2);
}

const sql = neon(databaseUrl);
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

try {
  const claims = await sql`
    SELECT id, value, status, legal_approved, COALESCE(source, '') AS source, updated_at
    FROM claims_registry
    ORDER BY id ASC
  `;

  const schemaRows = await sql`
    SELECT table_schema, table_name, column_name, data_type, is_nullable,
           COALESCE(column_default, '') AS column_default, ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('claims_registry','leads','rate_limits','analytics_events','site_config','landing_pages','audit_logs')
    ORDER BY table_schema, table_name, ordinal_position
  `;

  const normalizedClaims = claims.map((row) => ({
    id: row.id,
    value: row.value,
    status: row.status,
    legal_approved: row.legal_approved,
    source: row.source,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));

  const normalizedSchema = schemaRows.map((row) => ({
    table_schema: row.table_schema,
    table_name: row.table_name,
    column_name: row.column_name,
    data_type: row.data_type,
    is_nullable: row.is_nullable,
    column_default: row.column_default,
    ordinal_position: Number(row.ordinal_position),
  }));

  const output = {
    claims: normalizedClaims,
    schema_fingerprint: sha256(JSON.stringify(normalizedSchema)),
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
} catch (error) {
  console.error("Failed to capture governed Neon snapshot:", error);
  process.exit(1);
}
