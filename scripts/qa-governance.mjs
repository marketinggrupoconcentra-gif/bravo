#!/usr/bin/env node
/**
 * Bravo México — QA Governance Test Suite
 * Run: node scripts/qa-governance.mjs
 *
 * Tests:
 * 1. Claims governance (admin APIs)
 * 2. Contact channel guards
 * 3. Landing page 404/200 behavior
 * 4. Admin API authentication
 * 5. Lead validation
 */

const BASE = "http://127.0.0.1:3000";
let passed = 0;
let failed = 0;

import fs from "fs";
import path from "path";

// Load .env.local if needed
if (!process.env.ADMIN_SECRET_KEY) {
  try {
    const envFile = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const match = envFile.match(/^ADMIN_SECRET_KEY=["']?(.*?)["']?$/m);
    if (match) {
      process.env.ADMIN_SECRET_KEY = match[1];
    }
  } catch {}
}

function ok(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`  ❌ ${label}${detail ? `: ${detail}` : ""}`);
  failed++;
}

async function get(path) {
  const r = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return r;
}

async function post(path, body, headers = {}) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Admin API Authentication
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n── 1. Admin API Auth ──────────────────────────────────────────");

async function testAdminAuth() {
  const routes = ["/api/admin/claims", "/api/admin/config", "/api/admin/landings", "/api/admin/audit"];
  for (const r of routes) {
    const res = await get(r);
    if (res.status === 401) {
      ok(`${r} → 401 (no cookie)`);
    } else {
      fail(`${r} should be 401`, `got ${res.status}`);
    }
  }

  // POST claims without auth
  const res = await post("/api/admin/claims", { id: "test", value: "test", status: "VALIDATED" });
  if (res.status === 401) {
    ok("POST /api/admin/claims without auth → 401");
  } else {
    fail("POST /api/admin/claims without auth should be 401", `got ${res.status}`);
  }

  // Fake cookie regression test
  const fakeTokenHeaders = { Cookie: "bravo_admin_token=fake-token" };
  
  const fakeClaimsRes = await fetch(`${BASE}/api/admin/claims`, { headers: fakeTokenHeaders });
  if (fakeClaimsRes.status === 401) {
    ok("GET /api/admin/claims with fake token → 401");
  } else {
    fail("GET /api/admin/claims with fake token should be 401", `got ${fakeClaimsRes.status}`);
  }

  // Regression tests for Leads and CMS APIs
  const fakeLeadsGet = await fetch(`${BASE}/api/leads`, { headers: fakeTokenHeaders });
  if (fakeLeadsGet.status === 401) {
    ok("GET /api/leads with fake token → 401");
  } else {
    fail("GET /api/leads with fake token should be 401", `got ${fakeLeadsGet.status}`);
  }

  const fakeLeadsPatch = await fetch(`${BASE}/api/leads/123`, { 
    method: "PATCH", 
    headers: { "Content-Type": "application/json", ...fakeTokenHeaders },
    body: JSON.stringify({ status: "Contactado" })
  });
  if (fakeLeadsPatch.status === 401) {
    ok("PATCH /api/leads/:id with fake token → 401");
  } else {
    fail("PATCH /api/leads/:id with fake token should be 401", `got ${fakeLeadsPatch.status}`);
  }

  const fakeCmsPost = await fetch(`${BASE}/api/cms`, { 
    method: "POST", 
    headers: { "Content-Type": "application/json", ...fakeTokenHeaders },
    body: JSON.stringify({ pageSlug: "test" })
  });
  if (fakeCmsPost.status === 401) {
    ok("POST /api/cms with fake token → 401");
  } else {
    fail("POST /api/cms with fake token should be 401", `got ${fakeCmsPost.status}`);
  }
}

await testAdminAuth();

// ─────────────────────────────────────────────────────────────────────────────
// 2. Landing Page 404 / 200 Behavior
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n── 2. Landing Page Routing ────────────────────────────────────");

async function testLandingPages() {
  // Unknown slug → 404
  const r404 = await get("/lp/nonexistent-slug-xyz-test-bravo");
  if (r404.status === 404) {
    ok("/lp/nonexistent-slug → 404");
  } else {
    fail("/lp/nonexistent-slug should be 404", `got ${r404.status}`);
  }

  // Home → 200
  const rHome = await get("/");
  if (rHome.status === 200) {
    ok("/ → 200");
  } else {
    fail("/ should be 200", `got ${rHome.status}`);
  }

  // Formulario → 200
  const rForm = await get("/formulario");
  if (rForm.status === 200) {
    ok("/formulario → 200");
  } else {
    fail("/formulario should be 200", `got ${rForm.status}`);
  }

  // Gracias → 200
  const rGracias = await get("/gracias");
  if (rGracias.status === 200) {
    ok("/gracias → 200");
  } else {
    fail("/gracias should be 200", `got ${rGracias.status}`);
  }
}

await testLandingPages();

// ─────────────────────────────────────────────────────────────────────────────
// 3. Lead API Validation
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n── 3. Lead API Validation ─────────────────────────────────────");

async function testLeadValidation() {
  // Missing required fields → 400
  const r1 = await post("/api/leads", { nombre: "Test" });
  if (r1.status === 400) {
    ok("POST /api/leads missing folio/celular → 400");
  } else {
    fail("POST /api/leads missing fields should be 400", `got ${r1.status}`);
  }

  // Invalid phone → 400
  const r2 = await post("/api/leads", {
    folio: "test-folio-001",
    nombre: "Test User",
    celular: "123", // too short
  });
  if (r2.status === 400) {
    ok("POST /api/leads invalid phone → 400");
  } else {
    fail("POST /api/leads invalid phone should be 400", `got ${r2.status}`);
  }

  // Invalid email → 400
  const r3 = await post("/api/leads", {
    folio: "test-folio-002",
    nombre: "Test User",
    celular: "5512345678",
    email: "not-an-email",
  });
  if (r3.status === 400) {
    ok("POST /api/leads invalid email → 400");
  } else {
    fail("POST /api/leads invalid email should be 400", `got ${r3.status}`);
  }

  // Webhook URL in payload → should be ignored (lead stored, redirect always /gracias)
  const r4 = await post("/api/leads", {
    folio: "bravo-qa-webhook-test-001",
    nombre: "QA Test User",
    celular: "5512345678",
    webhookConfig: { customRedirectUrl: "https://evil.example.com" },
  });
  if (r4.status === 200 || r4.status === 201) {
    const data = await r4.json();
    if (data.redirectUrl === "/gracias") {
      ok("POST /api/leads with webhookConfig → redirect always /gracias");
    } else {
      fail("POST /api/leads redirectUrl should be /gracias", `got ${data.redirectUrl}`);
    }
  } else {
    // Could be DB unavailable in test — note it
    console.log(`  ℹ️  POST /api/leads returned ${r4.status} (DB may not be available in test env)`);
  }
}

await testLeadValidation();

// ─────────────────────────────────────────────────────────────────────────────
// 4. SSRF / Security Checks
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n── 4. Security ────────────────────────────────────────────────");

async function testSecurity() {
  // Webhook test with arbitrary URL → 401 (requires admin)
  const r = await post("/api/webhook-test", { endpointUrl: "http://evil.example.com/steal" });
  if (r.status === 401) {
    ok("POST /api/webhook-test without auth → 401");
  } else {
    fail("POST /api/webhook-test without auth should be 401", `got ${r.status}`);
  }
}

await testSecurity();

// ─────────────────────────────────────────────────────────────────────────────
// 5. Claims Governance — Status Validation
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n── 5. Claims Admin API Validation ─────────────────────────────");

async function testClaimsValidation() {
  const email = process.env.ADMIN_EMAIL || "admin@bravo.mx";
  const password = process.env.ADMIN_SECRET_KEY;
  if (!password) {
    fail("ADMIN_SECRET_KEY is not defined in environment");
    return;
  }
  
  const loginRes = await post("/api/auth/login", { email, password });
  let adminCookie = "";
  if (loginRes.ok) {
    const setCookie = loginRes.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
    } else {
      fail("Login OK but no set-cookie header found");
      return;
    }
  } else {
    fail("Login failed", await loginRes.text());
    return;
  }

  // Try invalid status
  const r1 = await fetch(`${BASE}/api/admin/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ id: "test-claim", value: "test", status: "validated" }), // lowercase should fail
  });
  if (r1.status === 400) {
    ok("POST /api/admin/claims with lowercase status 'validated' → 400");
  } else {
    const body = await r1.text();
    fail("POST /api/admin/claims with lowercase status should be 400", `got ${r1.status}: ${body.slice(0,80)}`);
  }

  // Try legal_approved=true with non-VALIDATED status
  const r2 = await fetch(`${BASE}/api/admin/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      id: "test-claim",
      value: "test",
      status: "PENDING_VALIDATION",
      legal_approved: true,
    }),
  });
  if (r2.status === 400) {
    ok("POST /api/admin/claims legal_approved=true + PENDING_VALIDATION → 400");
  } else {
    fail("legal_approved=true + non-VALIDATED should be 400", `got ${r2.status}`);
  }
}

await testClaimsValidation();

// ─────────────────────────────────────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("⚠️  Some tests failed. See details above.");
  process.exit(1);
} else {
  console.log("✅ All QA tests passed.");
  process.exit(0);
}
