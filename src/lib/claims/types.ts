/**
 * Shared claim governance types.
 *
 * These types are the single source of truth for claim status values
 * across Admin, DB, resolver, and frontend.
 *
 * UPPERCASE values are used everywhere — in the DB, resolver queries,
 * admin UI, and config. Never use lowercase "validated" or mixed case.
 */

/** Valid values for claims_registry.status */
export type ClaimStatus = "VALIDATED" | "PENDING_VALIDATION" | "REJECTED";

/** A claim as stored in the registry */
export interface Claim {
  id: string;
  label?: string;
  value: string;
  status: ClaimStatus;
  source?: string;
  sourceDate?: string;
  legalApproved: boolean;
  lastModified?: string;
  modifiedBy?: string;
}

/** Resolved claim value — null means do not render */
export type ResolvedClaim = string | null;

/** Map of claim IDs to resolved values */
export type ResolvedClaimsMap = Record<string, ResolvedClaim>;

/**
 * The only claim IDs that are allowed to appear on public pages.
 * Adding new IDs here requires legal + product approval.
 */
export const PUBLIC_CLAIM_IDS = [
  "experience-years",
  "debts-liquidated",
  "countries-operating",
  "credits-placed",
  "minimum-debt",
  "response-sla",
  "reviews-rating",
  "reviews-count",
  "ssl-encryption",
  "phone-support",
  "business-hours",
] as const;

export type PublicClaimId = (typeof PUBLIC_CLAIM_IDS)[number];

/**
 * Validates that a status string is a valid ClaimStatus.
 */
export function isValidClaimStatus(status: string): status is ClaimStatus {
  return (
    status === "VALIDATED" ||
    status === "PENDING_VALIDATION" ||
    status === "REJECTED"
  );
}
