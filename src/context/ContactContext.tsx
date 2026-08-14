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

// Safe defaults: all channels start as NOT CONFIGURED (empty strings).
// Floating widget is off by default until an admin configures a real number.
// Public components MUST check isChannelConfigured() before rendering any channel.
export const DEFAULT_CONTACT_CONFIG: ContactChannelsConfig = {
  whatsappNumber: "",
  whatsappCountryCode: "+52",
  whatsappFormatted: "",
  whatsappGreeting: "Hola, me gustaría revisar mis opciones para liquidar mis deudas con Bravo México.",
  floatingWidgetEnabled: false, // Off until a real number is configured
  floatingWidgetPosition: "bottom-right",
  floatingWidgetText: "¿Dudas con tus deudas? Escríbenos",
  supportPhone: "",
  supportEmail: "",
  businessHours: "",
  youtubeUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
};

const STORAGE_KEY = "bravo_contact_channels_config";

interface ContactContextType {
  config: ContactChannelsConfig;
  updateConfig: (updates: Partial<ContactChannelsConfig>) => void;
  getWhatsAppUrl: (customText?: string) => string;
  isChannelConfigured: (channel: keyof ContactChannelsConfig) => boolean;
}

const ContactContext = createContext<ContactContextType | null>(null);

export function ContactChannelsProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ContactChannelsConfig>(DEFAULT_CONTACT_CONFIG);

  useEffect(() => {
    async function fetchConfig() {
      try {
        // 1. Always try server-side config first (source of truth)
        const res = await fetch("/api/config?key=contact_channels");
        if (res.ok) {
          const { success, data } = await res.json();
          if (success && data) {
            setConfig((prev) => ({ ...prev, ...data }));
            // Cache for instant load on next visit — but server always wins
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_CONTACT_CONFIG, ...data }));
            } catch {}
            return;
          }
        }

        // 2. Fallback to local cache only if server unavailable
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          // Guard: never restore a placeholder phone from cache
          if (parsed.whatsappNumber === "5512345678" || parsed.whatsappFormatted?.includes("1234 5678")) {
            // Stale placeholder — discard
            localStorage.removeItem(STORAGE_KEY);
            return;
          }
          setConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn("[ContactContext] Could not load config:", err);
      }
    }

    fetchConfig();
  }, []);

  const updateConfig = async (updates: Partial<ContactChannelsConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);

    try {
      // Persist to Postgres via Admin API (source of truth)
      await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "contact_channels", value: updated }),
      });
      // Update local cache after server confirms
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to save contact channels to DB", err);
    }
  };

  const getWhatsAppUrl = (customText?: string): string => {
    if (!config.whatsappNumber) return "";
    const rawNumber = `${config.whatsappCountryCode}${config.whatsappNumber}`.replace(/[^0-9]/g, "");
    if (!rawNumber) return "";
    const message = encodeURIComponent(customText || config.whatsappGreeting);
    return `https://wa.me/${rawNumber}?text=${message}`;
  };

  /**
   * Check if a specific channel has been configured with a real non-empty value.
   * Public components must use this to avoid rendering unconfigured placeholders.
   */
  const isChannelConfigured = (channel: keyof ContactChannelsConfig): boolean => {
    const val = config[channel];
    if (typeof val === "boolean") return val;
    if (typeof val === "string") return val.trim().length > 0;
    return false;
  };

  return (
    <ContactContext.Provider value={{ config, updateConfig, getWhatsAppUrl, isChannelConfigured }}>
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
      getWhatsAppUrl: () => "",
      isChannelConfigured: () => false,
    };
  }
  return context;
}
