/**
 * Home Page — Server Component
 *
 * Resolves governed claims from Neon DB server-side before rendering.
 * Hero receives pre-resolved claims as props — never reads static config.
 *
 * Architecture:
 *   Neon claims_registry (status=VALIDATED, legal_approved=true)
 *     → resolveClaimsMapFromDB() [server-side]
 *       → Hero props
 *         → public render
 *
 * If DB is unavailable or a claim is not approved, value = null → hidden.
 */

import React from "react";
import { resolveClaimsMapFromDB } from "@/lib/claims/resolver";
import HomePageClient from "./HomePageClient";

// Revalidate every 5 minutes — claims changes propagate quickly
export const revalidate = 300;

export default async function Home() {
  // Resolve all hero claims server-side in a single query
  const claims = await resolveClaimsMapFromDB([
    "experience-years",
    "debts-liquidated",
    "countries-operating",
    "credits-placed",
    "minimum-debt",
  ]);

  return <HomePageClient claims={claims} />;
}
