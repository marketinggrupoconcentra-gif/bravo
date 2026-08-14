"use client";

import React, { useState } from "react";
import { useContactChannels, DEFAULT_CONTACT_CONFIG, ContactChannelsConfig } from "@/context/ContactContext";

export function WhatsAppSettingsStudio() {
  const { config, updateConfig, getWhatsAppUrl } = useContactChannels();
  const [formData, setFormData] = useState<ContactChannelsConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof ContactChannelsConfig, value: any) => {
    setFormData((prev: ContactChannelsConfig) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Format full number
    const cleanDigits = formData.whatsappNumber.replace(/[^0-9]/g, "");
    const formatted = `${formData.whatsappCountryCode} ${cleanDigits.slice(0, 2)} ${cleanDigits.slice(2, 6)} ${cleanDigits.slice(6)}`;
    
    const updated = {
      ...formData,
      whatsappNumber: cleanDigits,
      whatsappFormatted: formatted,
    };

    updateConfig(updated);
    setFormData(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_CONTACT_CONFIG);
    updateConfig(DEFAULT_CONTACT_CONFIG);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const testUrl = getWhatsAppUrl(formData.whatsappGreeting);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
            <span>Módulo de Atención y Canales</span>
            <span>·</span>
            <span className="text-[#157A5A]">Configuración en Vivo</span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Canales de Contacto y WhatsApp
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-[#FAF8FB] text-[#5B5266] hover:text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-bold transition-all cursor-pointer"
          >
            Restablecer Valores
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#157A5A] hover:bg-[#106247] text-white rounded-xl text-[13px] font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
            <span>Configuración de WhatsApp y canales actualizada con éxito en todo el sitio web.</span>
          </div>
          <span className="text-[12px] font-mono text-[#157A5A] opacity-80">En Vivo</span>
        </div>
      )}

      {/* Main Grid: Settings (7 cols) + Live WhatsApp Phone Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Settings Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: WhatsApp Core Configuration */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-[#F0EDF3] pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Línea Oficial de WhatsApp</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">Número receptor de leads y consultas directas</p>
              </div>
            </div>

            {/* Country Code + Phone Number Input */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                  Código de País:
                </label>
                <select
                  value={formData.whatsappCountryCode}
                  onChange={(e) => handleChange("whatsappCountryCode", e.target.value)}
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13.5px] font-bold focus:outline-none focus:border-[#5B2C72]"
                >
                  <option value="+52">+52 (México)</option>
                  <option value="+1">+1 (EE. UU. / Canadá)</option>
                  <option value="+57">+57 (Colombia)</option>
                  <option value="+34">+34 (España)</option>
                  <option value="+54">+54 (Argentina)</option>
                </select>
              </div>

              <div className="sm:col-span-8 flex flex-col gap-1.5">
                <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                  Número de Teléfono Celular (10 dígitos):
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  placeholder="5512345678"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[14px] font-mono font-bold focus:outline-none focus:border-[#5B2C72]"
                />
              </div>
            </div>

            {/* Custom Pre-filled Greeting Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                Mensaje Predeterminado al Abrir el Chat:
              </label>
              <textarea
                rows={3}
                value={formData.whatsappGreeting}
                onChange={(e) => handleChange("whatsappGreeting", e.target.value)}
                placeholder="Escribe el mensaje con el que iniciará la conversación..."
                className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] leading-relaxed focus:outline-none focus:border-[#5B2C72]"
              />
              <span className="text-[11.5px] text-[#8A8095]">
                Este texto aparecerá precargado en la caja de texto de WhatsApp cuando el prospecto haga clic en el botón.
              </span>
            </div>

            {/* Direct Test Link */}
            <div className="p-3.5 bg-[#F5EDF9] border border-[#DDCBE6] rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#5B2C72]">Enlace Dinámico Generado:</span>
                <span className="text-[11px] font-mono text-[#5B5266] truncate max-w-[340px]">{testUrl}</span>
              </div>
              <a
                href={testUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#5B2C72] hover:bg-[#45205A] text-white text-[12px] font-bold rounded-lg transition-colors shrink-0"
              >
                Probar en WhatsApp ↗
              </a>
            </div>
          </div>

          {/* Card 2: Floating WhatsApp Widget Options */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Botón Flotante en la Web</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">Widget verde interactivo para todas las páginas</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.floatingWidgetEnabled}
                  onChange={(e) => handleChange("floatingWidgetEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
              </label>
            </div>

            {formData.floatingWidgetEnabled && (
              <div className="flex flex-col gap-4">
                {/* Position Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                    Posición en Pantalla:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange("floatingWidgetPosition", "bottom-right")}
                      className={`p-3 rounded-xl border text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.floatingWidgetPosition === "bottom-right"
                          ? "bg-[#F1FAF6] text-[#157A5A] border-[#157A5A] shadow-2xs"
                          : "bg-[#FAF8FB] text-[#5B5266] border-[#E7E3EC]"
                      }`}
                    >
                      <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19H9m10 0V9m0 10l-14-14" />
                      </svg>
                      <span>Inferior Derecha (Predeterminado)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("floatingWidgetPosition", "bottom-left")}
                      className={`p-3 rounded-xl border text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.floatingWidgetPosition === "bottom-left"
                          ? "bg-[#F1FAF6] text-[#157A5A] border-[#157A5A] shadow-2xs"
                          : "bg-[#FAF8FB] text-[#5B5266] border-[#E7E3EC]"
                      }`}
                    >
                      <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h10m-10 0V9m0 10l14-14" />
                      </svg>
                      <span>Inferior Izquierda</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Bubble Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                    Texto del Globo de Ayuda:
                  </label>
                  <input
                    type="text"
                    value={formData.floatingWidgetText}
                    onChange={(e) => handleChange("floatingWidgetText", e.target.value)}
                    placeholder="¿Dudas con tus deudas? Escríbenos"
                    className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-medium focus:outline-none focus:border-[#5B2C72]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Official Social Media Channels */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="border-b border-[#F0EDF3] pb-3 flex justify-between items-start">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Redes Sociales Oficiales</h3>
                <p className="text-[12.5px] text-[#5B5266] m-0">Enlaces a perfiles y canales reflejados dinámicamente en el pie de página</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#157A5A] bg-[#F1FAF6] px-2.5 py-0.5 rounded-full border border-[#C6E6D9]">
                Pie de Página
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* YouTube */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#FF0000] fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>YouTube (Canal Oficial):</span>
                  </label>
                  {formData.youtubeUrl && (
                    <a
                      href={formData.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar canal</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.youtubeUrl || ""}
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/@bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* Facebook */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook (Página Oficial):</span>
                  </label>
                  {formData.facebookUrl && (
                    <a
                      href={formData.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar página</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.facebookUrl || ""}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#E4405F] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram:</span>
                  </label>
                  {formData.instagramUrl && (
                    <a
                      href={formData.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar perfil</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* TikTok */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#17131F] fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.79 1.34-.03 2.58-.88 3.03-2.13.23-.62.3-1.3.28-1.96V0z" />
                    </svg>
                    <span>TikTok:</span>
                  </label>
                  {formData.tiktokUrl && (
                    <a
                      href={formData.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar TikTok</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.tiktokUrl || ""}
                  onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                  placeholder="https://tiktok.com/@bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn (Empresarial):</span>
                  </label>
                  {formData.linkedinUrl && (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar perfil</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/company/bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>

              {/* X / Twitter */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#17131F] fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X / Twitter:</span>
                  </label>
                  {formData.twitterUrl && (
                    <a
                      href={formData.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11.5px] font-bold text-[#5B2C72] hover:underline flex items-center gap-0.5"
                    >
                      <span>Probar perfil</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.twitterUrl || ""}
                  onChange={(e) => handleChange("twitterUrl", e.target.value)}
                  placeholder="https://x.com/bravomexico"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-mono focus:outline-none focus:border-[#5B2C72]"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Additional Institutional Contact Lines */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
            <div className="border-b border-[#F0EDF3] pb-3">
              <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">Canales Institucionales</h3>
              <p className="text-[12.5px] text-[#5B5266] m-0">Teléfono 800, correo y horarios reflejados en el sitio</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                  Línea Gratuita 800:
                </label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) => handleChange("supportPhone", e.target.value)}
                  placeholder="800 000 0000"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                  Correo de Atención a Clientes:
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  placeholder="atencion@bravo.mx"
                  className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                Horarios de Atención:
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => handleChange("businessHours", e.target.value)}
                placeholder="Lunes a Viernes 9:00 a 19:00..."
                className="px-3.5 py-2.5 bg-[#FAF8FB] text-[#17131F] border border-[#C9C1D4] rounded-xl text-[13px] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Live Simulator Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Smartphone Simulator */}
          <div className="bg-[#170B1F] p-6 rounded-[28px] border border-[#3A2244] shadow-xl flex flex-col items-center gap-4 text-white">
            <div className="text-center">
              <span className="text-[11px] font-mono font-bold text-[#5ECBDB] uppercase tracking-widest">
                Simulador en Vivo de WhatsApp
              </span>
            </div>

            {/* Simulated Smartphone Shell */}
            <div className="w-full max-w-[320px] bg-[#111B21] rounded-[36px] border-[6px] border-[#222E35] overflow-hidden shadow-2xl flex flex-col">
              {/* Phone Status Bar / WhatsApp Header */}
              <div className="bg-[#202C33] p-3 text-white flex items-center justify-between border-b border-[#2A3942]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#5B2C72] text-[#5ECBDB] font-extrabold flex items-center justify-center text-[13px] shadow-sm">
                    B
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-bold text-[#E9EDEF]">Bravo México</span>
                    <span className="text-[10.5px] text-[#8696A0]">en línea · verificado</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#8696A0]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </div>
              </div>

              {/* Chat Conversation Area */}
              <div
                className="p-3.5 flex flex-col gap-3 min-h-[260px] bg-cover"
                style={{
                  backgroundColor: "#0B141A",
                  backgroundImage:
                    "radial-gradient(#202C33 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                {/* Encryption Badge */}
                <div className="bg-[#182229] text-[#8696A0] text-[10px] p-1.5 rounded-lg text-center border border-[#222E35] flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3 text-[#F5C451] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Los mensajes y llamadas están cifrados de extremo a extremo.</span>
                </div>

                {/* Pre-filled Message Bubble */}
                <div className="self-end bg-[#005C4B] text-[#E9EDEF] text-[12px] p-2.5 rounded-xl rounded-tr-none max-w-[85%] shadow-md flex flex-col gap-1">
                  <span className="leading-relaxed whitespace-pre-wrap">{formData.whatsappGreeting}</span>
                  <span className="self-end text-[9px] text-[#8696A0] flex items-center gap-1">
                    <span>12:45 p. m.</span>
                    <svg className="w-3 h-3 text-[#53BDEB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7m-5 0l4 4" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="bg-[#202C33] p-2.5 flex items-center gap-2 border-t border-[#2A3942]">
                <div className="flex-1 bg-[#2A3942] text-[#8696A0] text-[11.5px] px-3 py-1.5 rounded-full">
                  Escribe un mensaje...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#00A884] text-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center text-[11.5px] text-[#C7B8D2] max-w-[280px]">
              Número activo: <strong className="text-white font-mono">{formData.whatsappCountryCode} {formData.whatsappNumber}</strong>
            </div>
          </div>

          {/* Social Media Footer Preview Box */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E7E3EC] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-2.5">
              <span className="text-[13px] font-extrabold text-[#17131F]">Vista Previa de Redes Sociales</span>
              <span className="text-[10.5px] font-mono font-bold text-[#5B2C72] bg-[#F5EDF9] px-2 py-0.5 rounded-md">
                Reflejado en Footer
              </span>
            </div>

            <p className="text-[12px] text-[#5B5266] m-0">
              Así verán los usuarios los botones de tus redes sociales en el pie de página del sitio:
            </p>

            <div className="p-4 bg-[#1E0F26] rounded-2xl flex items-center justify-center gap-3 flex-wrap shadow-inner">
              {formData.youtubeUrl && (
                <a
                  href={formData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all shadow-xs"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}

              {formData.facebookUrl && (
                <a
                  href={formData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-xs"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {formData.instagramUrl && (
                <a
                  href={formData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E4405F] text-white flex items-center justify-center transition-all shadow-xs"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {formData.tiktokUrl && (
                <a
                  href={formData.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all shadow-xs"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.79 1.34-.03 2.58-.88 3.03-2.13.23-.62.3-1.3.28-1.96V0z" />
                  </svg>
                </a>
              )}

              {formData.linkedinUrl && (
                <a
                  href={formData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all shadow-xs"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}

              {formData.twitterUrl && (
                <a
                  href={formData.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all shadow-xs"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
