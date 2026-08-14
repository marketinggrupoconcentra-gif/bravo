import React from "react";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Funciona | Bravo México",
  description: "Conoce el proceso de 4 pasos para liquidar tus deudas bancarias con un plan de ahorro y negociación personalizada.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <ProcessSection />
      <FinalCta />
    </>
  );
}
