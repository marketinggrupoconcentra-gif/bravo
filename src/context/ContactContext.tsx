"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ContactChannelsConfig {
  whatsappNumber: string;
  whatsappCountryCode: string;
  whatsappFormatted: string;
  whatsappGreeting: string;
  floatingWidgetEnabled: boolean;
  floatingWidgetPosition: "bottom-right" | "bottom-left";
  floatingWidgetText: string;
  supportPhone: string;
  supportEmail: string;
  businessHours: string;
  // Official Social Media Channels
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

export const DEFAULT_CONTACT_CONFIG: ContactChannelsConfig = {
  whatsappNumber: "5512345678",
  whatsappCountryCode: "+52",
  whatsappFormatted: "+52 55 1234 5678",
  whatsappGreeting: "Hola, me gustaría revisar mis opciones para liquidar mis deudas con descuento con Bravo México.",
  floatingWidgetEnabled: true,
  floatingWidgetPosition: "bottom-right",
  floatingWidgetText: "¿Dudas con tus deudas? Escríbenos",
  supportPhone: "800 000 0000",
  supportEmail: "atencion@bravo.mx",
  businessHours: "Lunes a Viernes 9:00 a 19:00, Sábados 9:00 a 14:00 (Hora CDMX)",
  youtubeUrl: "https://youtube.com/@bravomexico",
  facebookUrl: "https://facebook.com/bravomexico",
  instagramUrl: "https://instagram.com/bravomexico",
  tiktokUrl: "https://tiktok.com/@bravomexico",
  linkedinUrl: "https://linkedin.com/company/bravomexico",
  twitterUrl: "https://x.com/bravomexico",
};

const STORAGE_KEY = "bravo_contact_channels_config";

interface ContactContextType {
  config: ContactChannelsConfig;
  updateConfig: (updates: Partial<ContactChannelsConfig>) => void;
  getWhatsAppUrl: (customText?: string) => string;
}

const ContactContext = createContext<ContactContextType | null>(null);

export function ContactChannelsProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ContactChannelsConfig>(DEFAULT_CONTACT_CONFIG);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setConfig((prev) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateConfig = (updates: Partial<ContactChannelsConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const getWhatsAppUrl = (customText?: string) => {
    const rawNumber = `${config.whatsappCountryCode}${config.whatsappNumber}`.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(customText || config.whatsappGreeting);
    return `https://wa.me/${rawNumber}?text=${message}`;
  };

  return (
    <ContactContext.Provider value={{ config, updateConfig, getWhatsAppUrl }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactChannels() {
  const context = useContext(ContactContext);
  if (!context) {
    return {
      config: DEFAULT_CONTACT_CONFIG,
      updateConfig: () => {},
      getWhatsAppUrl: (customText?: string) => {
        const rawNumber = `${DEFAULT_CONTACT_CONFIG.whatsappCountryCode}${DEFAULT_CONTACT_CONFIG.whatsappNumber}`.replace(/[^0-9]/g, "");
        const message = encodeURIComponent(customText || DEFAULT_CONTACT_CONFIG.whatsappGreeting);
        return `https://wa.me/${rawNumber}?text=${message}`;
      },
    };
  }
  return context;
}
