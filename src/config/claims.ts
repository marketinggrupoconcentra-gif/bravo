export interface ClaimItem {
  id: string;
  value: string;
  status: "validated" | "pending_validation" | "rejected";
  source: string;
  sourceDate: string;
  legalApproved: boolean;
}

export const claimsRegistry: Record<string, ClaimItem> = {
  "phone-support": {
    id: "phone-support",
    value: "800 000 0000",
    status: "pending_validation",
    source: "Placeholder pending official client line",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "business-hours": {
    id: "business-hours",
    value: "Atención de lunes a sábado",
    status: "pending_validation",
    source: "Pending operational schedule validation",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "response-sla": {
    id: "response-sla",
    value: "Tiempo estimado de contacto: 24 h hábiles",
    status: "validated",
    source: "Standard lead routing SLA policy",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "minimum-debt": {
    id: "minimum-debt",
    value: "Deudas desde $50,000 MXN · sin consulta al buró en este paso",
    status: "validated",
    source: "Bravo program eligibility criteria",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "reviews-rating": {
    id: "reviews-rating",
    value: "4.8/5",
    status: "pending_validation",
    source: "Aggregated review score pending third-party audit",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "reviews-count": {
    id: "reviews-count",
    value: "1,200",
    status: "pending_validation",
    source: "Review count volume pending verification",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "ssl-encryption": {
    id: "ssl-encryption",
    value: "Cifrado SSL de extremo a extremo",
    status: "pending_validation",
    source: "Pending infrastructure production audit",
    sourceDate: "2026-08-13",
    legalApproved: false,
  },
  "experience-years": {
    id: "experience-years",
    value: "+15",
    status: "validated",
    source: "Bravo institutional foundation history",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "debts-liquidated": {
    id: "debts-liquidated",
    value: "+350 mil",
    status: "validated",
    source: "Bravo cumulative operational metrics",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "countries-operating": {
    id: "countries-operating",
    value: "6",
    status: "validated",
    source: "Bravo international footprint",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
  "credits-placed": {
    id: "credits-placed",
    value: "+50 mil",
    status: "validated",
    source: "Bravo financial placement portfolio",
    sourceDate: "2026-08-13",
    legalApproved: true,
  },
};

/**
 * Returns the claim value ONLY if status is 'validated' AND legalApproved is true.
 * Otherwise returns undefined or optional fallback.
 */
export function getValidatedClaim(id: string, fallback?: string): string | undefined {
  const claim = claimsRegistry[id];
  if (claim && claim.status === "validated" && claim.legalApproved) {
    return claim.value;
  }
  return fallback;
}
