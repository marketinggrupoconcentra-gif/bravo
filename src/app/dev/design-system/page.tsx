import React from "react";
import { Metadata } from "next";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  robots: {
    index: false,
  },
  title: "Design System | Bravo México",
};

export default function DesignSystemPage() {
  return (
    <div className="p-12 max-w-5xl mx-auto space-y-16">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-[--brand-text]">Design System</h1>
        <p className="text-[--brand-text-muted]">Componentes estructurales pendientes de tokens visuales de Claude Design.</p>
      </div>
      
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-6">Logos</h2>
        <div className="flex gap-8 items-center bg-gray-50 p-6 rounded-lg">
          <BrandLogo />
          <div className="bg-gray-900 p-4 rounded">
            <BrandLogo variant="white" />
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-6">Colores (Provisionales)</h2>
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-[--brand-primary] rounded-lg shadow flex items-end p-2 text-white text-xs font-bold">Primary</div>
          <div className="w-24 h-24 bg-[--brand-secondary] rounded-lg shadow flex items-end p-2 text-white text-xs font-bold">Secondary</div>
          <div className="w-24 h-24 bg-[--brand-text] rounded-lg shadow flex items-end p-2 text-white text-xs font-bold">Text</div>
          <div className="w-24 h-24 bg-[--brand-background] rounded-lg shadow border flex items-end p-2 text-xs font-bold">Background</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-6">Botones (Placeholders)</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-[--brand-primary] text-white rounded-md font-medium hover:bg-[--brand-accent]">Primario</button>
          <button className="px-6 py-3 border border-[--brand-primary] text-[--brand-primary] rounded-md font-medium hover:bg-purple-50">Secundario</button>
          <button className="px-6 py-3 text-[--brand-primary] font-medium hover:underline">Enlace</button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-6">Tipografía</h2>
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-[--brand-text]">Heading 1</h1>
          <h2 className="text-4xl font-bold text-[--brand-text]">Heading 2</h2>
          <h3 className="text-3xl font-semibold text-[--brand-text]">Heading 3</h3>
          <p className="text-base text-[--brand-text]">Párrafo normal. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p className="text-sm text-[--brand-text-muted]">Texto secundario. Lorem ipsum dolor sit amet.</p>
        </div>
      </section>
    </div>
  );
}
