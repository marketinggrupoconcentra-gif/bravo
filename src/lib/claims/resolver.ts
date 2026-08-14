/**
 * Server-side Claims Resolver
 *
 * This is the SINGLE source of truth for public claim rendering.
 * All public pages and components must use this instead of the static
 * config/claims.ts file to avoid governance bypass via hardcoded fallbacks.
 *
 * A claim is only resolvable when:
 *   status = 'VALIDATED' AND legal_approved = true
 *
 * If either condition is not met, the resolver returns null.
 * Callers must handle null by hiding the claim or using neutral copy — never
 * substituting a hardcoded numeric fallback.
 *
 * DB status values are UPPERCASE: VALIDATED | PENDING_VALIDATION | REJECTED
 */

import { sql, initDbSchema } from "@/lib/db/neon";
import type { ResolvedClaim, ResolvedClaimsMap } from "@/lib/claims/types";

export type { ResolvedClaim, ResolvedClaimsMap } from "@/lib/claims/types";

/**
 * Resolve a single claim from the database.
 * Returns the claim value if VALIDATED and legally approved; null otherwise.
 */
export async function resolveClaimFromDB(id: string): Promise<ResolvedClaim> {
  try {
    await initDbSchema();
    const result = await sql<{ value: string }[]>`
      SELECT value FROM claims_registry 
      WHERE id = ${id} 
        AND status = 'VALIDATED' 
        AND legal_approved = true
      LIMIT 1
    `;
    if (result.length > 0) {
      return result[0].value;
    }
    return null;
  } catch (err) {
    // On DB error, fail safe — return null, never a fallback number
    console.error(`[ClaimsResolver] Failed to resolve claim "${id}":`, err);
    return null;
  }
}

/**
 * Resolve multiple claims in a single query.
 * Returns a map of id → value for approved claims; id → null for others.
 */
export async function resolveClaimsMapFromDB(
  ids: string[]
): Promise<ResolvedClaimsMap> {
  const map: ResolvedClaimsMap = {};
  ids.forEach((id) => (map[id] = null));

  if (ids.length === 0) return map;

  try {
    await initDbSchema();
    const result = await sql<{ id: string; value: string }[]>`
      SELECT id, value FROM claims_registry
      WHERE id = ANY(${ids}::text[])
        AND status = 'VALIDATED'
        AND legal_approved = true
    `;
    for (const row of result) {
      map[row.id] = row.value;
    }
  } catch (err) {
    console.error("[ClaimsResolver] Failed to resolve claims map:", err);
  }

  return map;
}
