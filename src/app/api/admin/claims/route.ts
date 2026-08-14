import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { cookies } from "next/headers";
import { claimsRegistry as defaultClaims } from "@/config/claims";

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
    
    // Auto-seed from default claims if empty
    const countRes = await sql`SELECT COUNT(*) as count FROM claims_registry`;
    if (countRes[0].count === "0" || countRes[0].count === 0) {
      for (const [id, claim] of Object.entries(defaultClaims)) {
        await sql`
          INSERT INTO claims_registry (id, label, value, status, source, source_date, legal_approved)
          VALUES (
            ${id}, 
            ${id}, 
            ${claim.value}, 
            ${claim.status === "validated" ? "VALIDATED" : "PENDING_VALIDATION"}, 
            ${claim.source}, 
            ${claim.sourceDate || null}, 
            ${claim.legalApproved}
          ) ON CONFLICT DO NOTHING
        `;
      }
    }

    const claims = await sql`SELECT * FROM claims_registry ORDER BY id ASC`;
    return NextResponse.json(claims);
  } catch (error) {
    console.error("[Admin Claims GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, value, status, source, legal_approved } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await initDbSchema();

    const previous = await sql`SELECT * FROM claims_registry WHERE id = ${id}`;
    const previousValue = previous.length > 0 ? previous[0] : null;

    // Convert booleans for neon
    const isApproved = legal_approved === true || legal_approved === "true" || legal_approved === 1;

    if (previousValue) {
      await sql`
        UPDATE claims_registry
        SET value = ${value},
            status = ${status},
            source = ${source},
            legal_approved = ${isApproved},
            updated_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO claims_registry (id, label, value, status, source, legal_approved)
        VALUES (${id}, ${id}, ${value}, ${status}, ${source}, ${isApproved})
      `;
    }

    // Write audit log
    const newValue = { id, value, status, source, legal_approved: isApproved };
    await sql`
      INSERT INTO audit_logs (action, context_area, previous_value, new_value, user_identity)
      VALUES (
        'UPDATE_CLAIM',
        'claims',
        ${previousValue ? JSON.stringify(previousValue) : null}::jsonb,
        ${JSON.stringify(newValue)}::jsonb,
        'Administrador del Sistema'
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Claims POST Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
