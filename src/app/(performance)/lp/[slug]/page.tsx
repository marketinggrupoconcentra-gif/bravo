import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";
import { sql, initDbSchema } from "@/lib/db/neon";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  title: "Liquida tus deudas | Bravo México",
};

export default async function LandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;

  // Attempt DB lookup — distinguish between "not found" (404) and "error" (500)
  let landing: Record<string, string> | null = null;

  try {
    await initDbSchema();
    const res = await sql`
      SELECT slug, headline, subheadline, cta_text, status 
      FROM landing_pages 
      WHERE slug = ${params.slug} 
        AND status = 'PUBLISHED'
      LIMIT 1
    `;
    if ((res as any[]).length > 0) {
      landing = (res as any[])[0];
    }
  } catch (err) {
    // DB error is a 500 — do NOT call notFound(), let it propagate
    console.error(`[LP/${params.slug}] Database error:`, err);
    throw err;
  }

  // Clean 404 for unknown or unpublished slugs
  if (!landing) {
    notFound();
  }

  return (
    <>
      <Hero
        title={landing.headline || "Liquida tus deudas en menos tiempo"}
        subtitle={landing.subheadline || "Inicia tu precalificación ahora, sin compromiso."}
        ctaText={landing.cta_text || "Precalificar sin costo"}
        ctaHref="/formulario"
        ctaId="lp_hero"
        placement="lp_hero"
      />
      <Trust />
    </>
  );
}
