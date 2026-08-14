import React from "react";
import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Trust } from "@/components/sections/Trust";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  title: "Liquida tus deudas | Bravo México",
};

export default async function LandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return (
    <>
      <Hero 
        title={`Oferta especial para ${params.slug}`}
        subtitle="Inicia tu precalificación ahora."
        ctaText="Precalificar"
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
