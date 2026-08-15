#!/usr/bin/env node
import crypto from "crypto";
import { spawn } from "child_process";

const CLEANUP_FAILURE_MARKER = "Failed to clean up test leads:";

function hardFail(message) {
  console.error(`❌ ERROR: ${message}`);
  process.exit(1);
}

if (process.env.ALLOW_GOVERNANCE_MUTATIONS !== "true") {
  hardFail("ALLOW_GOVERNANCE_MUTATIONS=true must be explicitly set to run the Governance QA suite.");
}

const databaseUrl = process.env.DATABASE_URL;
const expectedIdentity = process.env.GOVERNANCE_TEST_DB_IDENTITY_SHA256?.trim().toLowerCase();

if (!databaseUrl) {
  hardFail("DATABASE_URL is required for Governance QA.");
}

if (!expectedIdentity || !/^[a-f0-9]{64}$/.test(expectedIdentity)) {
  hardFail("GOVERNANCE_TEST_DB_IDENTITY_SHA256 must be a 64-character SHA-256 hex digest for the approved QA database.");
}

let parsedDatabaseUrl;
try {
  parsedDatabaseUrl = new URL(databaseUrl);
} catch {
  hardFail("DATABASE_URL is not a valid URL.");
}

if (parsedDatabaseUrl.protocol !== "postgres:" && parsedDatabaseUrl.protocol !== "postgresql:") {
  hardFail("DATABASE_URL must use the postgres or postgresql protocol.");
}

const databaseName = decodeURIComponent(parsedDatabaseUrl.pathname.replace(/^\/+/, ""));
if (!parsedDatabaseUrl.hostname || !databaseName) {
  hardFail("DATABASE_URL must include both a hostname and database name.");
}

const databaseIdentity = `${parsedDatabaseUrl.hostname.toLowerCase()}/${databaseName}`;
const actualIdentity = crypto.createHash("sha256").update(databaseIdentity).digest("hex");
const expectedBuffer = Buffer.from(expectedIdentity, "hex");
const actualBuffer = Buffer.from(actualIdentity, "hex");

if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
  hardFail("DATABASE_URL does not match the approved Governance QA database identity. Refusing all mutations.");
}

console.log("✅ Governance QA database identity verified.");

const child = spawn(process.execPath, ["scripts/qa-governance.mjs"], {
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

let stderr = "";

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  stderr += text;
  process.stderr.write(chunk);
});

child.on("error", (error) => {
  hardFail(`Unable to start Governance QA: ${error.message}`);
});

child.on("close", (code, signal) => {
  if (stderr.includes(CLEANUP_FAILURE_MARKER)) {
    console.error("❌ Governance QA cleanup failed. The suite is fail-closed even if all assertions passed.");
    process.exit(1);
  }

  if (signal) {
    console.error(`❌ Governance QA terminated by signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
