import React from "react";
import { SeoHeader } from "@/components/layout/SeoHeader";
import { Footer } from "@/components/layout/Footer";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precalificación | Bravo México",
  description: "Formulario inicial para evaluar tu caso con un asesor financiero especializado.",
};

export default function FormularioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1EEF3]">
      <SeoHeader />
      <main className="flex-grow py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-[620px]">
          <MultiStepForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
