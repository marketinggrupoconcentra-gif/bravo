/**
 * Static Claims Registry Seed (config/claims.ts)
 *
 * IMPORTANT: This file is a SEED reference and type definition only.
 * It is NOT the runtime source of truth for public rendering.
 *
 * For public rendering, use: src/lib/claims/resolver.ts
 * which reads from the claims_registry table in Neon Postgres.
 *
 * This file provides:
 * 1. TypeScript types (ClaimItem).
 * 2. The initial seed values for DB migration / first-time setup.
 * 3. The getValidatedClaim() function — FOR ADMIN AND INTERNAL USE ONLY.
 *    Public components must NOT import getValidatedClaim() as a fallback.
 *
 * Status MUST use UPPERCASE values: VALIDATED | PENDING_VALIDATION | REJECTED
 */

import type { ClaimStatus } from "@/lib/claims/types";
export type { ClaimStatus } from "@/lib/claims/types";

export interface ClaimItem {
  id: string;
  value: string;
  /** Status MUST be uppercase: VALIDATED | PENDING_VALIDATION | REJECTED */
  status: ClaimStatus;
  source: string;
  sourceDate: string;
  legalApproved: boolean;
}

export const claimsRegistry: Record<string, ClaimItem> = {
  "phone-support": {
    id: "phone-support",
    value: "800 000 0000",
    status: "PENDING_VALIDATION",
    source: "Placeholder pending official client line",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "business-hours": {
    id: "business-hours",
    value: "Atención de lunes a sábado",
    status: "PENDING_VALIDATION",
    source: "Pending operational schedule validation",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "response-sla": {
    id: "response-sla",
    value: "Tiempo estimado de contacto: 24 h hábiles",
    status: "VALIDATED",
    source: "Standard lead routing SLA policy",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "minimum-debt": {
    id: "minimum-debt",
    value: "Deudas desde $50,000 MXN · evaluación sin consulta al Buró de Crédito en este paso",
    status: "VALIDATED",
    source: "Bravo program eligibility criteria",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "reviews-rating": {
    id: "reviews-rating",
    value: "4.8/5",
    status: "PENDING_VALIDATION",
    source: "Aggregated review score pending third-party audit",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "reviews-count": {
    id: "reviews-count",
    value: "1,200",
    status: "PENDING_VALIDATION",
    source: "Review count volume pending verification",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "ssl-encryption": {
    id: "ssl-encryption",
    value: "Tus datos están protegidos según nuestro Aviso de Privacidad",
    status: "PENDING_VALIDATION",
    source: "Pending infrastructure production audit",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "experience-years": {
    id: "experience-years",
    value: "+15",
    status: "VALIDATED",
    source: "Bravo institutional foundation history",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "debts-liquidated": {
    id: "debts-liquidated",
    value: "+350 mil",
    status: "VALIDATED",
    source: "Bravo cumulative operational metrics",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "countries-operating": {
    id: "countries-operating",
    value: "6",
    status: "VALIDATED",
    source: "Bravo international footprint",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "credits-placed": {
    id: "credits-placed",
    value: "+50 mil",
    status: "VALIDATED",
    source: "Bravo financial placement portfolio",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
};

/**
 * Returns the claim value ONLY if status is 'VALIDATED' AND legalApproved is true.
 * Otherwise returns null (never a hardcoded fallback).
 *
 * FOR ADMIN AND INTERNAL USE ONLY.
 * Public components must use resolveClaimFromDB() from src/lib/claims/resolver.ts.
 */
export function getValidatedClaim(id: string): string | null {
  const claim = claimsRegistry[id];
  if (claim && claim.status === "VALIDATED" && claim.legalApproved) {
    return claim.value;
  }
  return null;
}
