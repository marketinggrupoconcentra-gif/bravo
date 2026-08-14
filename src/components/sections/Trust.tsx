import React from "react";

interface TrustProps {
  title?: string;
  items: {
    value: string;
    label: string;
  }[];
}

export function Trust({ title, items }: TrustProps) {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-[--container-max]">
        {title && (
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[--brand-text-muted] mb-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4">
              <span className="text-3xl md:text-4xl font-bold text-[--brand-primary] mb-2">{item.value}</span>
              <span className="text-sm font-medium text-[--brand-text-muted]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
