"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface TrackingTagsConfig {
  // Google Tag Manager
  gtmEnabled: boolean;
  gtmId: string; // e.g. GTM-XXXXXXX

  // Google Analytics 4
  ga4Enabled: boolean;
  ga4Id: string; // e.g. G-XXXXXXXXXX

  // Meta Pixel (Facebook / Instagram)
  metaPixelEnabled: boolean;
  metaPixelId: string; // 15-16 digit numeric ID

  // TikTok Pixel
  tiktokPixelEnabled: boolean;
  tiktokPixelId: string; // 18-24 alphanumeric ID

  // Google Ads Conversion Tag
  googleAdsEnabled: boolean;
  googleAdsConversionId: string; // e.g. AW-123456789
  googleAdsConversionLabel: string; // e.g. AbC_dEf123 (opcional para leads)

  // Microsoft Clarity
  clarityEnabled: boolean;
  clarityProjectId: string; // e.g. 9abcdefgh

  // Hotjar
  hotjarEnabled: boolean;
  hotjarSiteId: string; // e.g. 1234567

  // Domain Verification Meta Tags (<head>)
  metaDomainVerification: string; // e.g. d4q8e2h7k9p1m3w5v6x0z or <meta name="facebook-domain-verification" content="..." />
  metaDomainVerificationEnabled: boolean;
  googleSiteVerification: string; // e.g. a1b2c3d4e5f6g7h8 or <meta name="google-site-verification" content="..." />
  googleSiteVerificationEnabled: boolean;
  bingSiteVerification: string; // e.g. msvalidate.01 token or tag
  bingSiteVerificationEnabled: boolean;
  customMetaTags: string; // e.g. other <meta ... /> tags
  customMetaTagsEnabled: boolean;

  // Custom Scripts (Header & Body)
  customHeadScript: string;
  customHeadScriptEnabled: boolean;
  customBodyScript: string;
  customBodyScriptEnabled: boolean;
}

export const DEFAULT_TRACKING_CONFIG: TrackingTagsConfig = {
  gtmEnabled: true,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-BRAVOMX01",
  ga4Enabled: true,
  ga4Id: process.env.NEXT_PUBLIC_GA_ID || "G-BRAVOMX01",
  metaPixelEnabled: true,
  metaPixelId: "1849203847291034",
  tiktokPixelEnabled: false,
  tiktokPixelId: "",
  googleAdsEnabled: false,
  googleAdsConversionId: "",
  googleAdsConversionLabel: "",
  clarityEnabled: false,
  clarityProjectId: "",
  hotjarEnabled: false,
  hotjarSiteId: "",
  metaDomainVerification: "d4q8e2h7k9p1m3w5v6x0z",
  metaDomainVerificationEnabled: true,
  googleSiteVerification: "gsv_bravo_mx_verified_token",
  googleSiteVerificationEnabled: true,
  bingSiteVerification: "",
  bingSiteVerificationEnabled: false,
  customMetaTags: "",
  customMetaTagsEnabled: false,
  customHeadScript: "",
  customHeadScriptEnabled: false,
  customBodyScript: "",
  customBodyScriptEnabled: false,
};

const STORAGE_KEY = "bravo_tracking_tags_config";

// Parameter Validators ("Candados a las Cajas")
export const VALIDATION_RULES = {
  gtm: {
    pattern: /^GTM-[A-Z0-9]{4,11}$/i,
    example: "GTM-XXXXXXX",
    clean: (val: string) => {
      const match = val.match(/GTM-[A-Z0-9]+/i);
      return match ? match[0].toUpperCase() : val.trim().toUpperCase();
    },
    validate: (val: string) => !val || /^GTM-[A-Z0-9]{4,11}$/i.test(val),
    helper: "Debe comenzar con GTM- seguido de 4 a 11 caracteres alfanuméricos.",
  },
  ga4: {
    pattern: /^G-[A-Z0-9]{8,14}$/i,
    example: "G-XXXXXXXXXX",
    clean: (val: string) => {
      const match = val.match(/G-[A-Z0-9]+/i);
      return match ? match[0].toUpperCase() : val.trim().toUpperCase();
    },
    validate: (val: string) => !val || /^G-[A-Z0-9]{8,14}$/i.test(val),
    helper: "Debe comenzar con G- seguido de 8 a 14 caracteres alfanuméricos.",
  },
  metaPixel: {
    pattern: /^\d{14,17}$/,
    example: "1849203847291034",
    clean: (val: string) => {
      const digits = val.replace(/\D/g, "");
      return digits;
    },
    validate: (val: string) => !val || /^\d{14,17}$/.test(val),
    helper: "ID numérico de 14 a 17 dígitos proporcionado por Meta Business Suite.",
  },
  tiktokPixel: {
    pattern: /^[A-Z0-9]{18,24}$/i,
    example: "C9ABCDEF123456789012",
    clean: (val: string) => {
      const match = val.match(/[A-Z0-9]{18,24}/i);
      return match ? match[0].toUpperCase() : val.trim().toUpperCase();
    },
    validate: (val: string) => !val || /^[A-Z0-9]{18,24}$/i.test(val),
    helper: "Código alfanumérico de 18 a 24 caracteres de TikTok Ads Manager.",
  },
  googleAds: {
    pattern: /^(AW-)?\d{8,12}$/i,
    example: "AW-123456789 o 123456789",
    clean: (val: string) => {
      const trimmed = val.trim();
      if (/^\d{8,12}$/.test(trimmed)) return `AW-${trimmed}`;
      return trimmed.toUpperCase();
    },
    validate: (val: string) => !val || /^(AW-)?\d{8,12}$/i.test(val),
    helper: "ID de conversión de Google Ads (formato AW-XXXXXXXXX o numérico).",
  },
  clarity: {
    pattern: /^[a-z0-9]{8,14}$/i,
    example: "k78s9df02a",
    clean: (val: string) => val.trim().toLowerCase(),
    validate: (val: string) => !val || /^[a-z0-9]{8,14}$/i.test(val),
    helper: "ID de proyecto alfanumérico de Microsoft Clarity.",
  },
  hotjar: {
    pattern: /^\d{6,10}$/,
    example: "3456789",
    clean: (val: string) => val.replace(/\D/g, ""),
    validate: (val: string) => !val || /^\d{6,10}$/.test(val),
    helper: "ID numérico de sitio de 6 a 10 dígitos de Hotjar.",
  },
  metaDomain: {
    pattern: /^[a-z0-9_-]{10,64}$/i,
    example: "d4q8e2h7k9p1m3w5v6x0z",
    clean: (val: string) => {
      const match = val.match(/content=["']?([^"'>\s]+)["']?/i);
      if (match) return match[1];
      return val.trim();
    },
    validate: (val: string) => !val || /^[a-z0-9_-]{8,64}$/i.test(val) || val.includes("content="),
    helper: "Código de verificación de Meta Business Suite o meta tag completa.",
  },
  googleSite: {
    pattern: /^[a-z0-9_-]{10,64}$/i,
    example: "a1b2c3d4e5f6g7h8",
    clean: (val: string) => {
      const match = val.match(/content=["']?([^"'>\s]+)["']?/i);
      if (match) return match[1];
      return val.trim();
    },
    validate: (val: string) => !val || /^[a-z0-9_-]{8,64}$/i.test(val) || val.includes("content="),
    helper: "Código de verificación de Google Search Console o meta tag completa.",
  },
  bingSite: {
    pattern: /^[a-z0-9_-]{10,64}$/i,
    example: "msvalidate_token_12345",
    clean: (val: string) => {
      const match = val.match(/content=["']?([^"'>\s]+)["']?/i);
      if (match) return match[1];
      return val.trim();
    },
    validate: (val: string) => !val || /^[a-z0-9_-]{8,64}$/i.test(val) || val.includes("content="),
    helper: "Código de verificación msvalidate.01 de Bing Webmaster Tools.",
  },
};

interface TrackingTagsContextType {
  config: TrackingTagsConfig;
  updateConfig: (updates: Partial<TrackingTagsConfig>) => void;
  resetDefaults: () => void;
}

const TrackingTagsContext = createContext<TrackingTagsContextType | null>(null);

export function TrackingTagsProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TrackingTagsConfig>(DEFAULT_TRACKING_CONFIG);

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

  const updateConfig = (updates: Partial<TrackingTagsConfig>) => {
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

  const resetDefaults = () => {
    setConfig(DEFAULT_TRACKING_CONFIG);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRACKING_CONFIG));
    } catch {
      // ignore
    }
  };

  return (
    <TrackingTagsContext.Provider value={{ config, updateConfig, resetDefaults }}>
      {children}
    </TrackingTagsContext.Provider>
  );
}

export function useTrackingTags() {
  const context = useContext(TrackingTagsContext);
  if (!context) {
    return {
      config: DEFAULT_TRACKING_CONFIG,
      updateConfig: () => {},
      resetDefaults: () => {},
    };
  }
  return context;
}
