import { NextResponse } from "next/server";
import { sql, initDbSchema } from "@/lib/db/neon";
import { requireAdminSession, getAdminIdentityLabel } from "@/lib/auth/admin";
import { claimsRegistry as defaultClaims } from "@/config/claims";
import { isValidClaimStatus } from "@/lib/claims/types";
import type { ClaimStatus } from "@/lib/claims/types";

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    await initDbSchema();

    // Auto-seed has been moved to src/lib/db/neon.ts for global fail-closed recovery

    const claims = await sql`SELECT * FROM claims_registry ORDER BY id ASC`;
    return NextResponse.json(claims);
  } catch (error) {
    console.error("[Admin Claims GET Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, value, status, source, legal_approved } = body;

    // ── Input validation ──────────────────────────────────────────────────
    if (!id || typeof id !== "string" || id.length > 80) {
      return NextResponse.json({ error: "Invalid or missing 'id'" }, { status: 400 });
    }
    if (!value || typeof value !== "string" || value.length > 500) {
      return NextResponse.json({ error: "Invalid or missing 'value'" }, { status: 400 });
    }
    if (!status || !isValidClaimStatus(status)) {
      return NextResponse.json(
        { error: `Invalid 'status'. Must be one of: VALIDATED, PENDING_VALIDATION, REJECTED` },
        { status: 400 }
      );
    }
    const claimStatus: ClaimStatus = status;
    const isApproved = legal_approved === true || legal_approved === "true" || legal_approved === 1;

    // ── Prevent approving a non-VALIDATED claim ───────────────────────────
    if (isApproved && claimStatus !== "VALIDATED") {
      return NextResponse.json(
        { error: "legal_approved can only be true when status is VALIDATED" },
        { status: 400 }
      );
    }

    await initDbSchema();

    const previous = await sql`SELECT * FROM claims_registry WHERE id = ${id}`;
    const previousValue = (previous as any[]).length > 0 ? (previous as any[])[0] : null;

    const sourceText = typeof source === "string" ? source.slice(0, 500) : null;

    if (previousValue) {
      await sql`
        UPDATE claims_registry
        SET value = ${value},
            status = ${claimStatus},
            source = ${sourceText},
            legal_approved = ${isApproved},
            updated_at = NOW()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO claims_registry (id, label, value, status, source, legal_approved)
        VALUES (${id}, ${id}, ${value}, ${claimStatus}, ${sourceText}, ${isApproved})
      `;
    }

    // Write audit log
    const newValue = { id, value, status: claimStatus, source: sourceText, legal_approved: isApproved };
    await sql`
      INSERT INTO audit_logs (action, context_area, previous_value, new_value, user_identity)
      VALUES (
        'UPDATE_CLAIM',
        'claims',
        ${previousValue ? JSON.stringify(previousValue) : null}::jsonb,
        ${JSON.stringify(newValue)}::jsonb,
        ${getAdminIdentityLabel()}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Claims POST Error]", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
