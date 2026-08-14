"use client";

import React, { useState } from "react";
import {
  useTrackingTags,
  DEFAULT_TRACKING_CONFIG,
  TrackingTagsConfig,
  VALIDATION_RULES,
} from "@/context/TrackingTagsContext";

export function TrackingTagsStudio() {
  const { config, updateConfig, resetDefaults } = useTrackingTags();
  const [formData, setFormData] = useState<TrackingTagsConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeDiagnostic, setActiveDiagnostic] = useState<{ [key: string]: boolean }>({});

  const handleChange = (field: keyof TrackingTagsConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSmartClean = (
    field: keyof TrackingTagsConfig,
    rawVal: string,
    cleaner: (val: string) => string
  ) => {
    const cleaned = cleaner(rawVal);
    setFormData((prev) => ({ ...prev, [field]: cleaned }));
  };

  const handleSave = () => {
    updateConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    resetDefaults();
    setFormData(DEFAULT_TRACKING_CONFIG);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Run live in-browser window objects diagnostics
  const runDiagnostics = () => {
    if (typeof window === "undefined") return;
    const diag: { [key: string]: boolean } = {
      dataLayer: typeof (window as any).dataLayer !== "undefined",
      gtag: typeof (window as any).gtag === "function",
      fbq: typeof (window as any).fbq === "function",
      ttq: typeof (window as any).ttq === "object",
      clarity: typeof (window as any).clarity === "function",
      hj: typeof (window as any).hj === "function",
    };
    setActiveDiagnostic(diag);
  };

  // Count active tags
  const activeCount = [
    formData.gtmEnabled && formData.gtmId,
    formData.ga4Enabled && formData.ga4Id,
    formData.metaPixelEnabled && formData.metaPixelId,
    formData.tiktokPixelEnabled && formData.tiktokPixelId,
    formData.googleAdsEnabled && formData.googleAdsConversionId,
    formData.clarityEnabled && formData.clarityProjectId,
    formData.hotjarEnabled && formData.hotjarSiteId,
    formData.metaDomainVerificationEnabled && formData.metaDomainVerification,
    formData.googleSiteVerificationEnabled && formData.googleSiteVerification,
    formData.customHeadScriptEnabled && formData.customHeadScript,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
            <span>Rastreo y Analítica de Datos</span>
            <span>·</span>
            <span className="text-[#157A5A]">{activeCount} Etiquetas Activas</span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Etiquetas, Píxeles y Códigos de Seguimiento
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#FAF8FB] text-[#5B5266] hover:text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-bold transition-all cursor-pointer"
          >
            Restablecer
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#157A5A] hover:bg-[#106247] text-white rounded-xl text-[13px] font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-4 bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 text-[13.5px] font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#157A5A] animate-ping" />
            <span>Configuración de etiquetas y píxeles sincronizada con éxito en el código fuente de la web.</span>
          </div>
          <span className="text-[12px] font-mono text-[#157A5A] opacity-80">En Vivo</span>
        </div>
      )}

      {/* Main Grid: Tag Configuration Boxes (7 cols) + Diagnostics & Code Placement Guide (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tracking Configuration Cards */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Google Suite (GTM, GA4, Google Ads) */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center font-bold">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Ecosistema Google</h3>
                  <p className="text-[12.5px] text-[#5B5266] m-0">Google Tag Manager, Analytics 4 y Conversiones Ads</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#5B2C72] bg-[#F5EDF9] px-2.5 py-0.5 rounded-full">
                Head & Body
              </span>
            </div>

            {/* Google Tag Manager (GTM) */}
            <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-bold text-[#17131F]">Google Tag Manager (GTM):</label>
                  {formData.gtmId && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        VALIDATION_RULES.gtm.validate(formData.gtmId)
                          ? "bg-[#F1FAF6] text-[#157A5A]"
                          : "bg-[#FFF1F3] text-[#DF1C41]"
                      }`}
                    >
                      {VALIDATION_RULES.gtm.validate(formData.gtmId) ? "Formato Válido" : "Formato Inválido"}
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gtmEnabled}
                    onChange={(e) => handleChange("gtmEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#157A5A]"></div>
                </label>
              </div>

              <input
                type="text"
                value={formData.gtmId}
                onChange={(e) =>
                  handleSmartClean("gtmId", e.target.value, VALIDATION_RULES.gtm.clean)
                }
                placeholder="GTM-XXXXXXX"
                className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13.5px] font-mono font-bold focus:outline-none transition-colors ${
                  formData.gtmId && !VALIDATION_RULES.gtm.validate(formData.gtmId)
                    ? "border-[#DF1C41] bg-[#FFF8F9]"
                    : "border-[#C9C1D4] focus:border-[#5B2C72]"
                }`}
              />

              <div className="flex justify-between items-center text-[11.5px] text-[#8A8095]">
                <span>{VALIDATION_RULES.gtm.helper}</span>
                <span className="font-mono text-[#5B2C72] font-semibold">Ej: GTM-BRAVOMX01</span>
              </div>
            </div>

            {/* Google Analytics 4 (GA4) */}
            <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-bold text-[#17131F]">Google Analytics 4 (Measurement ID):</label>
                  {formData.ga4Id && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        VALIDATION_RULES.ga4.validate(formData.ga4Id)
                          ? "bg-[#F1FAF6] text-[#157A5A]"
                          : "bg-[#FFF1F3] text-[#DF1C41]"
                      }`}
                    >
                      {VALIDATION_RULES.ga4.validate(formData.ga4Id) ? "Formato Válido" : "Formato Inválido"}
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ga4Enabled}
                    onChange={(e) => handleChange("ga4Enabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#157A5A]"></div>
                </label>
              </div>

              <input
                type="text"
                value={formData.ga4Id}
                onChange={(e) =>
                  handleSmartClean("ga4Id", e.target.value, VALIDATION_RULES.ga4.clean)
                }
                placeholder="G-XXXXXXXXXX"
                className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13.5px] font-mono font-bold focus:outline-none transition-colors ${
                  formData.ga4Id && !VALIDATION_RULES.ga4.validate(formData.ga4Id)
                    ? "border-[#DF1C41] bg-[#FFF8F9]"
                    : "border-[#C9C1D4] focus:border-[#5B2C72]"
                }`}
              />

              <div className="flex justify-between items-center text-[11.5px] text-[#8A8095]">
                <span>{VALIDATION_RULES.ga4.helper}</span>
                <span className="font-mono text-[#5B2C72] font-semibold">Ej: G-5X7K98P1Q2</span>
              </div>
            </div>

            {/* Google Ads Conversions */}
            <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-bold text-[#17131F]">Google Ads (Etiqueta de Conversión):</label>
                  {formData.googleAdsConversionId && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        VALIDATION_RULES.googleAds.validate(formData.googleAdsConversionId)
                          ? "bg-[#F1FAF6] text-[#157A5A]"
                          : "bg-[#FFF1F3] text-[#DF1C41]"
                      }`}
                    >
                      {VALIDATION_RULES.googleAds.validate(formData.googleAdsConversionId)
                        ? "Formato Válido"
                        : "Formato Inválido"}
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.googleAdsEnabled}
                    onChange={(e) => handleChange("googleAdsEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#157A5A]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-[#8A8095] uppercase font-bold">Conversion ID:</span>
                  <input
                    type="text"
                    value={formData.googleAdsConversionId}
                    onChange={(e) =>
                      handleSmartClean(
                        "googleAdsConversionId",
                        e.target.value,
                        VALIDATION_RULES.googleAds.clean
                      )
                    }
                    placeholder="AW-123456789"
                    className="px-3.5 py-2 bg-white text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono font-bold focus:outline-none focus:border-[#5B2C72]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-[#8A8095] uppercase font-bold">
                    Conversion Label (Opcional):
                  </span>
                  <input
                    type="text"
                    value={formData.googleAdsConversionLabel}
                    onChange={(e) => handleChange("googleAdsConversionLabel", e.target.value.trim())}
                    placeholder="AbCd_1234_EfGh"
                    className="px-3.5 py-2 bg-white text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono font-bold focus:outline-none focus:border-[#5B2C72]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Social Media Pixels (Meta & TikTok) */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Píxeles de Campañas Pagadas</h3>
                  <p className="text-[12.5px] text-[#5B5266] m-0">Meta Pixel (Facebook/Instagram) y TikTok Ads</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#1877F2] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
                Head & Noscript
              </span>
            </div>

            {/* Meta Pixel (Facebook / Instagram) */}
            <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-bold text-[#17131F]">Meta Pixel ID (Facebook / Instagram):</label>
                  {formData.metaPixelId && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        VALIDATION_RULES.metaPixel.validate(formData.metaPixelId)
                          ? "bg-[#F1FAF6] text-[#157A5A]"
                          : "bg-[#FFF1F3] text-[#DF1C41]"
                      }`}
                    >
                      {VALIDATION_RULES.metaPixel.validate(formData.metaPixelId)
                        ? "Formato Válido"
                        : "Formato Inválido"}
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.metaPixelEnabled}
                    onChange={(e) => handleChange("metaPixelEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1877F2]"></div>
                </label>
              </div>

              <input
                type="text"
                value={formData.metaPixelId}
                onChange={(e) =>
                  handleSmartClean(
                    "metaPixelId",
                    e.target.value,
                    VALIDATION_RULES.metaPixel.clean
                  )
                }
                placeholder="1849203847291034"
                className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13.5px] font-mono font-bold focus:outline-none transition-colors ${
                  formData.metaPixelId && !VALIDATION_RULES.metaPixel.validate(formData.metaPixelId)
                    ? "border-[#DF1C41] bg-[#FFF8F9]"
                    : "border-[#C9C1D4] focus:border-[#5B2C72]"
                }`}
              />

              <div className="flex justify-between items-center text-[11.5px] text-[#8A8095]">
                <span>{VALIDATION_RULES.metaPixel.helper}</span>
                <span className="font-mono text-[#5B2C72] font-semibold">15 o 16 dígitos</span>
              </div>
            </div>

            {/* TikTok Pixel */}
            <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-bold text-[#17131F]">TikTok Pixel Code:</label>
                  {formData.tiktokPixelId && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        VALIDATION_RULES.tiktokPixel.validate(formData.tiktokPixelId)
                          ? "bg-[#F1FAF6] text-[#157A5A]"
                          : "bg-[#FFF1F3] text-[#DF1C41]"
                      }`}
                    >
                      {VALIDATION_RULES.tiktokPixel.validate(formData.tiktokPixelId)
                        ? "Formato Válido"
                        : "Formato Inválido"}
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tiktokPixelEnabled}
                    onChange={(e) => handleChange("tiktokPixelEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#000000]"></div>
                </label>
              </div>

              <input
                type="text"
                value={formData.tiktokPixelId}
                onChange={(e) =>
                  handleSmartClean(
                    "tiktokPixelId",
                    e.target.value,
                    VALIDATION_RULES.tiktokPixel.clean
                  )
                }
                placeholder="C9ABCDEF123456789012"
                className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13.5px] font-mono font-bold focus:outline-none transition-colors ${
                  formData.tiktokPixelId &&
                  !VALIDATION_RULES.tiktokPixel.validate(formData.tiktokPixelId)
                    ? "border-[#DF1C41] bg-[#FFF8F9]"
                    : "border-[#C9C1D4] focus:border-[#5B2C72]"
                }`}
              />

              <div className="flex justify-between items-center text-[11.5px] text-[#8A8095]">
                <span>{VALIDATION_RULES.tiktokPixel.helper}</span>
                <span className="font-mono text-[#5B2C72] font-semibold">18 a 24 caracteres</span>
              </div>
            </div>
          </div>

          {/* Card 3: Session Recording & Heatmaps (Clarity & Hotjar) */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Grabaciones de Sesión</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">Microsoft Clarity y Hotjar Analytics</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#5B2C72] bg-[#F5EDF9] px-2.5 py-0.5 rounded-full">
                Head Script
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Clarity */}
              <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-[#17131F]">Microsoft Clarity:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.clarityEnabled}
                      onChange={(e) => handleChange("clarityEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-4.5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0078D4]"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.clarityProjectId}
                  onChange={(e) => handleChange("clarityProjectId", e.target.value.trim())}
                  placeholder="ID de Proyecto (Ej: k78s9df02a)"
                  className="px-3 py-1.5 bg-white text-[#17131F] border border-[#C9C1D4] rounded-xl text-[12.5px] font-mono font-bold focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* Hotjar */}
              <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] font-bold text-[#17131F]">Hotjar Site ID:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hotjarEnabled}
                      onChange={(e) => handleChange("hotjarEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-4.5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#FD3A5C]"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.hotjarSiteId}
                  onChange={(e) => handleChange("hotjarSiteId", e.target.value.replace(/\D/g, ""))}
                  placeholder="Site ID (Ej: 3456789)"
                  className="px-3 py-1.5 bg-white text-[#17131F] border border-[#C9C1D4] rounded-xl text-[12.5px] font-mono font-bold focus:outline-none focus:border-[#5B2C72]"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Domain Verification Meta Tags */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Verificación de Dominio (Meta Tags)</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">
                  Etiquetas &lt;meta&gt; en &lt;head&gt; para validar propiedad en Meta Business Suite y Search Console
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#157A5A] bg-[#F1FAF6] border border-[#C6E6D9] px-2.5 py-0.5 rounded-full">
                &lt;head&gt; Meta
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Meta / Facebook Domain Verification */}
              <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[13px] font-bold text-[#17131F]">Meta / Facebook Domain Verification:</label>
                    {formData.metaDomainVerification && (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          VALIDATION_RULES.metaDomain.validate(formData.metaDomainVerification)
                            ? "bg-[#F1FAF6] text-[#157A5A]"
                            : "bg-[#FFF1F3] text-[#DF1C41]"
                        }`}
                      >
                        {VALIDATION_RULES.metaDomain.validate(formData.metaDomainVerification)
                          ? "Formato Válido"
                          : "Formato Inválido"}
                      </span>
                    )}
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.metaDomainVerificationEnabled}
                      onChange={(e) => handleChange("metaDomainVerificationEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1877F2]"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.metaDomainVerification}
                  onChange={(e) =>
                    handleSmartClean(
                      "metaDomainVerification",
                      e.target.value,
                      VALIDATION_RULES.metaDomain.clean
                    )
                  }
                  placeholder='d4q8e2h7k9p1m3w5v6x0z o <meta name="facebook-domain-verification" content="..." />'
                  className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13px] font-mono font-bold focus:outline-none transition-colors ${
                    formData.metaDomainVerification &&
                    !VALIDATION_RULES.metaDomain.validate(formData.metaDomainVerification)
                      ? "border-[#DF1C41] bg-[#FFF8F9]"
                      : "border-[#C9C1D4] focus:border-[#5B2C72]"
                  }`}
                />

                <div className="flex flex-col gap-1 text-[11.5px] text-[#8A8095]">
                  <div className="flex justify-between items-center">
                    <span>{VALIDATION_RULES.metaDomain.helper}</span>
                    <span className="font-mono text-[#1877F2] font-semibold">facebook-domain-verification</span>
                  </div>
                  {formData.metaDomainVerification && (
                    <div className="p-2 bg-white border border-[#E7E3EC] rounded-lg font-mono text-[11px] text-[#5B5266]">
                      &lt;meta name=&quot;facebook-domain-verification&quot; content=&quot;{VALIDATION_RULES.metaDomain.clean(formData.metaDomainVerification)}&quot; /&gt;
                    </div>
                  )}
                </div>
              </div>

              {/* Google Search Console Site Verification */}
              <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[13px] font-bold text-[#17131F]">Google Search Console Verification:</label>
                    {formData.googleSiteVerification && (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          VALIDATION_RULES.googleSite.validate(formData.googleSiteVerification)
                            ? "bg-[#F1FAF6] text-[#157A5A]"
                            : "bg-[#FFF1F3] text-[#DF1C41]"
                        }`}
                      >
                        {VALIDATION_RULES.googleSite.validate(formData.googleSiteVerification)
                          ? "Formato Válido"
                          : "Formato Inválido"}
                      </span>
                    )}
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.googleSiteVerificationEnabled}
                      onChange={(e) => handleChange("googleSiteVerificationEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4285F4]"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.googleSiteVerification}
                  onChange={(e) =>
                    handleSmartClean(
                      "googleSiteVerification",
                      e.target.value,
                      VALIDATION_RULES.googleSite.clean
                    )
                  }
                  placeholder='Token de verificación o <meta name="google-site-verification" content="..." />'
                  className={`px-3.5 py-2 bg-white text-[#17131F] border rounded-xl text-[13px] font-mono font-bold focus:outline-none transition-colors ${
                    formData.googleSiteVerification &&
                    !VALIDATION_RULES.googleSite.validate(formData.googleSiteVerification)
                      ? "border-[#DF1C41] bg-[#FFF8F9]"
                      : "border-[#C9C1D4] focus:border-[#5B2C72]"
                  }`}
                />

                <div className="flex flex-col gap-1 text-[11.5px] text-[#8A8095]">
                  <div className="flex justify-between items-center">
                    <span>{VALIDATION_RULES.googleSite.helper}</span>
                    <span className="font-mono text-[#4285F4] font-semibold">google-site-verification</span>
                  </div>
                  {formData.googleSiteVerification && (
                    <div className="p-2 bg-white border border-[#E7E3EC] rounded-lg font-mono text-[11px] text-[#5B5266]">
                      &lt;meta name=&quot;google-site-verification&quot; content=&quot;{VALIDATION_RULES.googleSite.clean(formData.googleSiteVerification)}&quot; /&gt;
                    </div>
                  )}
                </div>
              </div>

              {/* Bing Webmaster Tools */}
              <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#EAE5EF] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[13px] font-bold text-[#17131F]">Bing Webmaster Tools (msvalidate.01):</label>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bingSiteVerificationEnabled}
                      onChange={(e) => handleChange("bingSiteVerificationEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0078D4]"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.bingSiteVerification}
                  onChange={(e) =>
                    handleSmartClean(
                      "bingSiteVerification",
                      e.target.value,
                      VALIDATION_RULES.bingSite.clean
                    )
                  }
                  placeholder='Código de verificación o <meta name="msvalidate.01" content="..." />'
                  className="px-3.5 py-2 bg-white text-[#17131F] border border-[#C9C1D4] focus:border-[#5B2C72] rounded-xl text-[13px] font-mono font-bold focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Custom Header Script */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Inyección de Código Personalizado</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">
                  Para etiquetas de verificación de propiedad o scripts adicionales
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.customHeadScriptEnabled}
                  onChange={(e) => handleChange("customHeadScriptEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#157A5A]"></div>
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                Script JS o Meta Tag (Inyectado en &lt;head&gt;):
              </label>
              <textarea
                rows={4}
                value={formData.customHeadScript}
                onChange={(e) => handleChange("customHeadScript", e.target.value)}
                placeholder={'// Código JavaScript o etiquetas <script> / <meta>\nconsole.log("Bravo Tracking Activo");'}
                className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[12px] font-mono leading-relaxed focus:outline-none focus:border-[#5B2C72]"
              />
              <span className="text-[11px] text-[#8A8095]">
                Se ejecuta de forma asíncrona tras la interactividad de la página para no penalizar el Core Web Vitals.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Diagnostics & Code Placement Architecture (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card: Live Diagnostic Inspector */}
          <div className="bg-[#170B1F] p-6 rounded-[28px] border border-[#3A2244] shadow-xl flex flex-col gap-4 text-white">
            <div className="flex justify-between items-center border-b border-[#3A2244] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#157A5A] animate-ping" />
                <span className="text-[12px] font-mono font-bold text-[#5ECBDB] uppercase tracking-wider">
                  Diagnóstico en Tiempo Real
                </span>
              </div>
              <button
                type="button"
                onClick={runDiagnostics}
                className="px-3 py-1 bg-[#2E1739] hover:bg-[#45205A] border border-[#5B2C72] text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-[#C7B8D2] hover:text-white"
              >
                Comprobar en Vivo
              </button>
            </div>

            <p className="text-[12px] text-[#C7B8D2] m-0">
              Estado de los objetos globales en el navegador para cada proveedor de telemetría:
            </p>

            <div className="flex flex-col gap-2 font-mono text-[12px]">
              {/* GTM / DataLayer */}
              <div className="p-2.5 bg-[#22102C] rounded-xl border border-[#3A2244] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.gtmEnabled && formData.gtmId ? "bg-[#157A5A]" : "bg-[#8A8095]"
                    }`}
                  />
                  <span>GTM (dataLayer)</span>
                </div>
                <span className="text-[#C7B8D2] text-[11px]">
                  {formData.gtmEnabled && formData.gtmId ? formData.gtmId : "Inactivo"}
                </span>
              </div>

              {/* GA4 */}
              <div className="p-2.5 bg-[#22102C] rounded-xl border border-[#3A2244] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.ga4Enabled && formData.ga4Id ? "bg-[#157A5A]" : "bg-[#8A8095]"
                    }`}
                  />
                  <span>Google Analytics 4</span>
                </div>
                <span className="text-[#C7B8D2] text-[11px]">
                  {formData.ga4Enabled && formData.ga4Id ? formData.ga4Id : "Inactivo"}
                </span>
              </div>

              {/* Meta Pixel */}
              <div className="p-2.5 bg-[#22102C] rounded-xl border border-[#3A2244] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.metaPixelEnabled && formData.metaPixelId ? "bg-[#1877F2]" : "bg-[#8A8095]"
                    }`}
                  />
                  <span>Meta Pixel (fbq)</span>
                </div>
                <span className="text-[#C7B8D2] text-[11px]">
                  {formData.metaPixelEnabled && formData.metaPixelId ? formData.metaPixelId : "Inactivo"}
                </span>
              </div>

              {/* TikTok */}
              <div className="p-2.5 bg-[#22102C] rounded-xl border border-[#3A2244] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      formData.tiktokPixelEnabled && formData.tiktokPixelId ? "bg-[#5ECBDB]" : "bg-[#8A8095]"
                    }`}
                  />
                  <span>TikTok Pixel (ttq)</span>
                </div>
                <span className="text-[#C7B8D2] text-[11px]">
                  {formData.tiktokPixelEnabled && formData.tiktokPixelId ? formData.tiktokPixelId : "Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Code Architecture & Placement Guide */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
            <div className="border-b border-[#F0EDF3] pb-3">
              <h3 className="text-[16px] font-extrabold text-[#17131F] m-0">
                Arquitectura de Inyección en el Código
              </h3>
              <p className="text-[12px] text-[#5B5266] m-0">
                Ubicación exacta de cada etiqueta en el árbol DOM y Next.js App Router
              </p>
            </div>

            <div className="flex flex-col gap-3 text-[12.5px] leading-relaxed">
              <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#EAE5EF] flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono font-bold text-[11.5px] text-[#5B2C72]">
                  <span>&lt;head&gt; (Next Script afterInteractive)</span>
                  <span className="text-[#157A5A]">Asíncrono</span>
                </div>
                <p className="text-[#5B5266] text-[12px] m-0">
                  GTM container, GA4 gtag.js, Meta Pixel fbq init, TikTok ttq.load, Clarity y Google Ads.
                </p>
              </div>

              <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#EAE5EF] flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono font-bold text-[11.5px] text-[#1877F2]">
                  <span>&lt;body&gt; (Noscript Fallback)</span>
                  <span className="text-[#8A8095]">Sin JavaScript</span>
                </div>
                <p className="text-[#5B5266] text-[12px] m-0">
                  GTM iframe fallback y Meta Pixel 1x1 tracking beacon para navegadores con JS deshabilitado.
                </p>
              </div>

              <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#EAE5EF] flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono font-bold text-[11.5px] text-[#157A5A]">
                  <span>Optimización Core Web Vitals</span>
                  <span className="text-[#157A5A]">0ms Bloqueo</span>
                </div>
                <p className="text-[#5B5266] text-[12px] m-0">
                  Ningún script bloquea el renderizado visual inicial ni retrasa el LCP (Largest Contentful Paint).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
