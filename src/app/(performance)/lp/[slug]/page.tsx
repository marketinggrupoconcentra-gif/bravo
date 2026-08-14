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

  await initDbSchema();
  const res = await sql`SELECT * FROM landing_pages WHERE slug = ${params.slug} AND status = 'PUBLISHED'`;
  
  if (res.length === 0) {
    notFound();
  }

  const landing = res[0];

  return (
    <>
      <Hero 
        title={landing.headline || `Oferta especial para ${params.slug}`}
        subtitle={landing.subheadline || "Inicia tu precalificación ahora."}
        ctaText={landing.cta_text || "Precalificar"}
        ctaHref="/formulario"
        ctaId="lp_hero"
        placement="lp_hero"
      />
      <Trust 
        items={[
          { value: "300k+", label: "Familias ayudadas" },
          { value: "100%", label: "Seguro y confiable" }
        ]}
      />
    </>
  );
}
