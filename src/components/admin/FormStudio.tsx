"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon } from "@/components/icons/bravo";
import {
  FormStudioConfig,
  DEFAULT_FORM_STUDIO_CONFIG,
  FORM_PRESETS,
  FormStepConfig,
  FormFieldOption,
} from "@/config/formPresets";

export function FormStudio() {
  const [config, setConfig] = useState<FormStudioConfig>(DEFAULT_FORM_STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState<"general" | "steps" | "api_webhook" | "html_embed" | "presets">("general");
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    status?: number;
    durationMs?: number;
    responsePreview?: string;
    error?: string;
  } | null>(null);

  // Load saved config from local storage or server on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("bravo_form_studio_config");
      if (cached) {
        setConfig(JSON.parse(cached));
      }
    } catch {
      // ignore
    }
  }, []);

  // Update field in config
  const updateConfigField = <K extends keyof FormStudioConfig>(key: K, value: FormStudioConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  };

  // Update a specific step
  const updateStep = (index: number, updatedStep: Partial<FormStepConfig>) => {
    const newSteps = [...config.steps];
    newSteps[index] = { ...newSteps[index], ...updatedStep };
    updateConfigField("steps", newSteps);
  };

  // Add option to current step
  const handleAddOption = (stepIndex: number) => {
    const currentOptions = config.steps[stepIndex]?.options || [];
    const newOption: FormFieldOption = {
      value: `opcion_${Date.now()}`,
      label: "Nueva opción editable",
    };
    updateStep(stepIndex, { options: [...currentOptions, newOption] });
  };

  // Remove option from current step
  const handleRemoveOption = (stepIndex: number, optionIndex: number) => {
    const currentOptions = config.steps[stepIndex]?.options || [];
    const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
    updateStep(stepIndex, { options: newOptions });
  };

  // Edit option in current step
  const handleEditOption = (stepIndex: number, optionIndex: number, label: string, value: string) => {
    const currentOptions = [...(config.steps[stepIndex]?.options || [])];
    currentOptions[optionIndex] = { label, value };
    updateStep(stepIndex, { options: currentOptions });
  };

  // Headers management for webhook
  const handleAddHeader = () => {
    const headers = config.webhookHeaders || [];
    updateConfigField("webhookHeaders", [...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    const headers = (config.webhookHeaders || []).filter((_, idx) => idx !== index);
    updateConfigField("webhookHeaders", headers);
  };

  const handleEditHeader = (index: number, key: string, value: string) => {
    const headers = [...(config.webhookHeaders || [])];
    headers[index] = { key, value };
    updateConfigField("webhookHeaders", headers);
  };

  // Live test webhook
  const handleTestWebhook = async () => {
    if (!config.webhookUrl) return;
    setTestingWebhook(true);
    setWebhookTestResult(null);

    const headersObj: Record<string, string> = {};
    if (Array.isArray(config.webhookHeaders)) {
      config.webhookHeaders.forEach((h) => {
        if (h.key && h.value) headersObj[h.key] = h.value;
      });
    }

    try {
      const res = await fetch("/api/webhook-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpointUrl: config.webhookUrl,
          method: config.webhookMethod || "POST",
          headers: headersObj,
          payload: {
            lead_id: `test-lead-${Date.now()}`,
            folio: "BR-999999",
            nombre: "Juan Pérez (Lead Test)",
            celular: "5512345678",
            email: "contacto.test@bravo.mx",
            institucion: "BBVA México",
            monto: "$100,000 – $250,000",
            tipo_deuda: "Tarjeta de crédito",
            submitted_at: new Date().toISOString(),
            device: "Escritorio",
            referrer: "Form Studio Webhook Tester",
          },
        }),
      });

      const data = await res.json();
      setWebhookTestResult(data);
    } catch (err: any) {
      setWebhookTestResult({
        success: false,
        error: err?.message || "Error al conectar con endpoint externo",
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem("bravo_form_studio_config", JSON.stringify(config));
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }, 400);
    } catch {
      setIsSaving(false);
    }
  };

  // Load a preset template
  const handleLoadPreset = (preset: (typeof FORM_PRESETS)[0]) => {
    setConfig({
      ...config,
      title: preset.config.title,
      subtitle: preset.config.subtitle,
      minDebtText: preset.config.minDebtText,
      submitBtnText: preset.config.submitBtnText,
      steps: preset.config.steps,
    });
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  };

  const activeStep = config.steps[selectedStepIndex] || config.steps[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
            <span>Constructor y Editor de Formularios</span>
            <span>·</span>
            <span className="text-[#157A5A]">Integraciones API & Webhooks</span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Constructor de Formulario y Webhooks
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `bravo_formulario_config_${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3.5 py-2 rounded-full border border-[#C9C1D4] text-[12.5px] font-bold text-[#5B5266] hover:text-[#17131F] hover:bg-[#FAF8FB] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Settings & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Studio Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Mode Toggle: Nativo vs HTML Embed */}
          <div className="bg-[#2E1739] text-white p-4 rounded-[22px] border border-[#4A3A57] shadow-sm flex flex-col gap-3">
            <span className="text-[11.5px] font-mono text-[#5ECBDB] font-extrabold uppercase">
              Tipo de Motor de Formulario:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateConfigField("mode", "native")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  config.mode === "native"
                    ? "bg-[#5B2C72] border-[#5ECBDB] text-white shadow-md ring-1 ring-[#5ECBDB]"
                    : "bg-[#1E0F26] border-[#4A3A57] text-[#C7B8D2] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold">1. Formulario Nativo Multi-Paso</span>
                  {config.mode === "native" && <CheckIcon size={14} className="text-[#5ECBDB]" />}
                </div>
                <span className="text-[11px] opacity-80">
                  Calificación por pasos con telemetría integrada y diseño responsive.
                </span>
              </button>

              <button
                type="button"
                onClick={() => updateConfigField("mode", "html_embed")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  config.mode === "html_embed"
                    ? "bg-[#5B2C72] border-[#5ECBDB] text-white shadow-md ring-1 ring-[#5ECBDB]"
                    : "bg-[#1E0F26] border-[#4A3A57] text-[#C7B8D2] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold">2. Conexión HTML / Iframe / Embed</span>
                  {config.mode === "html_embed" && <CheckIcon size={14} className="text-[#5ECBDB]" />}
                </div>
                <span className="text-[11px] opacity-80">
                  Pega código externo de HubSpot, Typeform, Webflow o CRM personalizado.
                </span>
              </button>
            </div>
          </div>

          {/* Submodules Navigation Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E7E3EC] shadow-2xs gap-1 overflow-x-auto">
            {[
              { id: "general", label: "Textos y Redirección", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
              { id: "steps", label: "Pasos y Opciones", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { id: "api_webhook", label: "Reenvío API / Webhooks", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { id: "html_embed", label: "Código HTML Embed", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
              { id: "presets", label: "Plantillas", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#5B2C72] text-white shadow-2xs"
                    : "text-[#5B5266] hover:text-[#17131F]"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Settings Content Box */}
          <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
            {/* Notification Banner */}
            {saveSuccess && (
              <div className="bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] p-3 rounded-[14px] text-[13px] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckIcon size={16} />
                <span>¡Configuración del formulario guardada con éxito!</span>
              </div>
            )}

            {hasUnsavedChanges && !saveSuccess && (
              <div className="bg-[#FFF9E6] border border-[#FEDF89] text-[#B54708] p-2.5 rounded-[12px] text-[12px] font-bold flex items-center justify-between">
                <span>Tienes cambios sin guardar en el formulario.</span>
                <span className="text-[11px] font-mono opacity-80">Borrador activo</span>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* =============================================================
                  TAB 1: GENERAL & REDIRECCIÓN
                  ============================================================= */}
              {activeTab === "general" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#17131F]">
                      Título Principal del Formulario:
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => updateConfigField("title", e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8FB] focus:bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] rounded-lg text-[13.5px] font-bold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#17131F]">
                      Subtítulo / Bajada Descriptiva:
                    </label>
                    <textarea
                      rows={2}
                      value={config.subtitle}
                      onChange={(e) => updateConfigField("subtitle", e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8FB] focus:bg-white border border-[#C9C1D4] focus:border-[#5ECBDB] rounded-lg text-[13px] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F]">
                        Texto Botón Siguiente:
                      </label>
                      <input
                        type="text"
                        value={config.continueBtnText}
                        onChange={(e) => updateConfigField("continueBtnText", e.target.value)}
                        className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[13px] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F]">
                        Texto Botón Envío Final:
                      </label>
                      <input
                        type="text"
                        value={config.submitBtnText}
                        onChange={(e) => updateConfigField("submitBtnText", e.target.value)}
                        className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[13px] font-bold focus:outline-none text-[#157A5A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F]">
                        Aviso de Monto Mínimo:
                      </label>
                      <input
                        type="text"
                        value={config.minDebtText}
                        onChange={(e) => updateConfigField("minDebtText", e.target.value)}
                        className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12px] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#17131F]">
                        URL / Ruta de Redirección:
                      </label>
                      <input
                        type="text"
                        value={config.redirectUrl}
                        onChange={(e) => updateConfigField("redirectUrl", e.target.value)}
                        placeholder="/gracias"
                        className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12px] font-mono focus:outline-none text-[#5B2C72]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#17131F]">
                      Garantía y Aviso de Privacidad:
                    </label>
                    <input
                      type="text"
                      value={config.privacyText}
                      onChange={(e) => updateConfigField("privacyText", e.target.value)}
                      className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12px] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 2: PASOS Y OPCIONES
                  ============================================================= */}
              {activeTab === "steps" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                  {/* Step Selector Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#EAE5EF]">
                    {config.steps.map((s, idx) => (
                      <button
                        key={s.id || idx}
                        type="button"
                        onClick={() => setSelectedStepIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          selectedStepIndex === idx
                            ? "bg-[#2E1739] text-white shadow-2xs"
                            : "bg-[#FAF8FB] text-[#5B5266] border border-[#E7E3EC] hover:bg-[#F5EDF9]"
                        }`}
                      >
                        <span>Paso {idx + 1}: {s.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Step Properties */}
                  <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC] flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-bold text-[#5B2C72]">
                        Título del Paso {selectedStepIndex + 1}:
                      </label>
                      <input
                        type="text"
                        value={activeStep.title}
                        onChange={(e) => updateStep(selectedStepIndex, { title: e.target.value })}
                        className="w-full p-2 bg-white border border-[#C9C1D4] rounded-lg text-[13px] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-bold text-[#5B2C72]">
                        Pregunta Principal:
                      </label>
                      <input
                        type="text"
                        value={activeStep.question}
                        onChange={(e) => updateStep(selectedStepIndex, { question: e.target.value })}
                        className="w-full p-2 bg-white border border-[#C9C1D4] rounded-lg text-[13px] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-bold text-[#5B2C72]">
                        Texto de Ayuda / Helper:
                      </label>
                      <input
                        type="text"
                        value={activeStep.helperText || ""}
                        onChange={(e) => updateStep(selectedStepIndex, { helperText: e.target.value })}
                        className="w-full p-2 bg-white border border-[#C9C1D4] rounded-lg text-[12px] focus:outline-none"
                      />
                    </div>

                    {/* Step Options List (for steps with options) */}
                    {activeStep.options && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-[#EAE5EF]">
                        <div className="flex justify-between items-center">
                          <span className="text-[11.5px] font-bold text-[#17131F]">
                            Opciones del Paso ({activeStep.options.length}):
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddOption(selectedStepIndex)}
                            className="text-[11px] font-bold text-[#5B2C72] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            + Añadir opción
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                          {activeStep.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-[#E7E3EC]">
                              <input
                                type="text"
                                value={opt.label}
                                onChange={(e) => handleEditOption(selectedStepIndex, optIdx, e.target.value, opt.value)}
                                className="flex-1 p-1.5 text-[12.5px] border border-[#E7E3EC] rounded focus:outline-none focus:border-[#5ECBDB]"
                                placeholder="Texto visible"
                              />
                              <input
                                type="text"
                                value={opt.value}
                                onChange={(e) => handleEditOption(selectedStepIndex, optIdx, opt.label, e.target.value)}
                                className="w-28 p-1.5 text-[11px] font-mono text-[#8A8095] border border-[#E7E3EC] rounded focus:outline-none"
                                placeholder="valor_clave"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(selectedStepIndex, optIdx)}
                                className="p-1 text-[#B02A24] hover:bg-[#FEE4E2] rounded cursor-pointer"
                                title="Eliminar opción"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB: REENVÍO API & WEBHOOKS
                  ============================================================= */}
              {activeTab === "api_webhook" && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-150">
                  {/* Info Alert */}
                  <div className="p-3.5 bg-[#F1FAF6] border border-[#C6E6D9] rounded-2xl flex items-start gap-2.5 text-[12.5px] text-[#157A5A]">
                    <svg className="w-4 h-4 text-[#157A5A] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong>Garantía de Persistencia:</strong> Todos los prospectos <strong>siempre se guardan de forma segura en el sistema principal</strong>. Si activas esta opción, adicionalmente el sistema despachará el lead de inmediato hacia tu CRM o servicio externo vía HTTP API.
                    </div>
                  </div>

                  {/* Toggle Webhook Active */}
                  <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[13.5px] font-bold text-[#17131F]">
                        Activar Reenvío Automático de Leads vía API / Webhook
                      </span>
                      <span className="text-[11.5px] text-[#5B5266]">
                        Dispara una petición HTTP con el payload del lead cada vez que un usuario completa el formulario.
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(config.webhookEnabled)}
                        onChange={(e) => updateConfigField("webhookEnabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E7E3EC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#157A5A]"></div>
                    </label>
                  </div>

                  {config.webhookEnabled && (
                    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border border-[#E7E3EC] shadow-2xs">
                      {/* Endpoint URL & Method */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-3 flex flex-col gap-1">
                          <label className="text-[11.5px] font-mono font-bold text-[#8A8095] uppercase">
                            Método HTTP:
                          </label>
                          <select
                            value={config.webhookMethod || "POST"}
                            onChange={(e) => updateConfigField("webhookMethod", e.target.value as any)}
                            className="p-2.5 bg-[#FAF8FB] border border-[#C9C1D4] rounded-xl text-[13px] font-bold text-[#17131F] focus:outline-none"
                          >
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                          </select>
                        </div>

                        <div className="sm:col-span-9 flex flex-col gap-1">
                          <label className="text-[11.5px] font-mono font-bold text-[#8A8095] uppercase">
                            URL del Endpoint Receptor (API / Webhook):
                          </label>
                          <input
                            type="url"
                            value={config.webhookUrl || ""}
                            onChange={(e) => updateConfigField("webhookUrl", e.target.value)}
                            placeholder="https://api.tu-crm.com/v1/leads o https://hooks.zapier.com/..."
                            className="p-2.5 bg-[#FAF8FB] border border-[#C9C1D4] rounded-xl text-[13px] font-mono text-[#5B2C72] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Custom Headers Editor */}
                      <div className="flex flex-col gap-2 border-t border-[#F0EDF3] pt-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[12px] font-mono font-bold text-[#8A8095] uppercase">
                            Cabeceras HTTP Personalizadas (Headers / Auth Tokens):
                          </label>
                          <button
                            type="button"
                            onClick={handleAddHeader}
                            className="text-[12px] font-bold text-[#5B2C72] hover:underline cursor-pointer"
                          >
                            + Añadir Header
                          </button>
                        </div>

                        <div className="flex flex-col gap-2">
                          {(config.webhookHeaders || []).map((header, hIdx) => (
                            <div key={hIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  placeholder="Clave (ej. Authorization)"
                                  value={header.key}
                                  onChange={(e) => handleEditHeader(hIdx, e.target.value, header.value)}
                                  className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12px] font-mono"
                                />
                              </div>
                              <div className="sm:col-span-6">
                                <input
                                  type="text"
                                  placeholder="Valor (ej. Bearer eyJhbGciOi...)"
                                  value={header.value}
                                  onChange={(e) => handleEditHeader(hIdx, header.key, e.target.value)}
                                  className="w-full p-2 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12px] font-mono"
                                />
                              </div>
                              <div className="sm:col-span-1 flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHeader(hIdx)}
                                  className="text-[#B02A24] hover:text-red-700 p-1.5 rounded-lg hover:bg-[#FEE4E2] transition-colors cursor-pointer"
                                  title="Eliminar header"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Redirection Option */}
                      <div className="flex flex-col gap-2 border-t border-[#F0EDF3] pt-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-bold text-[#17131F]">
                            Redirección Tras Envío a URL Externa Personalizada
                          </label>
                          <input
                            type="checkbox"
                            checked={Boolean(config.customRedirectEnabled)}
                            onChange={(e) => updateConfigField("customRedirectEnabled", e.target.checked)}
                            className="rounded text-[#5B2C72]"
                          />
                        </div>

                        {config.customRedirectEnabled && (
                          <div className="flex flex-col gap-1 mt-1">
                            <input
                              type="url"
                              value={config.customRedirectUrl || ""}
                              onChange={(e) => updateConfigField("customRedirectUrl", e.target.value)}
                              placeholder="https://tudominio.com/gracias?lead_id={lead_id}&folio={folio}&nombre={nombre}"
                              className="p-2.5 bg-[#FAF8FB] border border-[#C9C1D4] rounded-xl text-[12.5px] font-mono text-[#5B2C72]"
                            />
                            <span className="text-[11px] text-[#8A8095]">
                              Puedes usar los comodines <code>{"{lead_id}"}</code>, <code>{"{folio}"}</code>, <code>{"{nombre}"}</code> para pasar parámetros UTM al destino.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Live Test Webhook Button & Visualizer */}
                      <div className="border-t border-[#F0EDF3] pt-3 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-mono font-bold text-[#17131F]">
                            Prueba de Conexión en Vivo:
                          </span>
                          <button
                            type="button"
                            onClick={handleTestWebhook}
                            disabled={testingWebhook || !config.webhookUrl}
                            className={`px-4 py-2 rounded-xl text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                              testingWebhook || !config.webhookUrl
                                ? "bg-[#EAE5EF] text-[#8A8095] cursor-not-allowed"
                                : "bg-[#5B2C72] hover:bg-[#45205A] text-white shadow-sm"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>{testingWebhook ? "Enviando lead de prueba..." : "Probar Webhook en Vivo"}</span>
                          </button>
                        </div>

                        {/* Test Result Viewer */}
                        {webhookTestResult && (
                          <div
                            className={`p-3.5 rounded-xl border text-[12px] flex flex-col gap-1.5 ${
                              webhookTestResult.success
                                ? "bg-[#F1FAF6] border-[#C6E6D9] text-[#157A5A]"
                                : "bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]"
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span className="flex items-center gap-1.5">
                                {webhookTestResult.success ? (
                                  <>
                                    <svg className="w-4 h-4 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Webhook Exitoso (HTTP {webhookTestResult.status})</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 text-[#B42318]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Error en Webhook (HTTP {webhookTestResult.status || "Fallo"})</span>
                                  </>
                                )}
                              </span>
                              {webhookTestResult.durationMs && (
                                <span className="font-mono text-[11px]">{webhookTestResult.durationMs}ms</span>
                              )}
                            </div>
                            {webhookTestResult.responsePreview && (
                              <pre className="p-2 bg-black/80 text-white font-mono text-[11px] rounded-lg overflow-x-auto">
                                {webhookTestResult.responsePreview}
                              </pre>
                            )}
                            {webhookTestResult.error && (
                              <span className="font-semibold">{webhookTestResult.error}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  TAB: CONEXIÓN HTML & EMBED
                  ============================================================= */}
              {activeTab === "html_embed" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-[#F0F9FF] border border-[#B9E6FE] rounded-xl text-[12px] text-[#026AA2]">
                    <strong>Conexión Externa por Código:</strong> Puedes incrustar cualquier formulario provisto por tu CRM (HubSpot, Typeform, Webflow, Google Forms o código HTML puro).
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#17131F]">
                      Código HTML / Embed Snippet / Iframe:
                    </label>
                    <textarea
                      rows={8}
                      value={config.htmlEmbedCode || ""}
                      onChange={(e) => updateConfigField("htmlEmbedCode", e.target.value)}
                      placeholder="<form action='https://api.tucrm.com/submit' ...> ... </form>"
                      className="w-full p-3 bg-[#1E0F26] text-[#5ECBDB] font-mono text-[12px] rounded-xl border border-[#3A2244] focus:outline-none focus:border-[#5ECBDB]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#17131F]">
                      URL de Webhook POST (Opcional para envío directo):
                    </label>
                    <input
                      type="url"
                      value={config.webhookUrl || ""}
                      onChange={(e) => updateConfigField("webhookUrl", e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="w-full p-2.5 bg-[#FAF8FB] border border-[#C9C1D4] rounded-lg text-[12.5px] font-mono focus:outline-none text-[#5B2C72]"
                    />
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 4: CARGAR PLANTILLAS PREDEFINIDAS
                  ============================================================= */}
              {activeTab === "presets" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                  <span className="text-[12px] font-bold text-[#17131F]">
                    Selecciona una plantilla para cargarla con 1 clic:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FORM_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-4 bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#E7E3EC] hover:border-[#AB6CCA] rounded-2xl transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold text-[#17131F]">{preset.name}</span>
                          <span className="text-[11.5px] text-[#5B5266]">{preset.desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLoadPreset(preset)}
                          className="w-full py-2 bg-[#5B2C72] hover:bg-[#45205A] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Cargar esta plantilla
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#EAE5EF]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full font-extrabold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    hasUnsavedChanges
                      ? "bg-[#157A5A] hover:bg-[#106247] text-white animate-pulse"
                      : "bg-[#5B2C72] hover:bg-[#45205A] text-white"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Guardando cambios...</span>
                    </>
                  ) : (
                    <span>Guardar y Publicar Formulario</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Form Preview */}
        <div className="lg:col-span-5 flex flex-col gap-3 sticky top-[80px]">
          <div className="bg-[#2E1739] text-white p-3.5 rounded-[20px] border border-[#4A3A57] flex justify-between items-center">
            <span className="text-[12px] font-mono text-[#5ECBDB] font-bold uppercase">
              Vista Previa en Vivo del Formulario
            </span>
            <span className="text-[11px] font-mono bg-[#1E0F26] px-2.5 py-0.5 rounded-full border border-[#4A3A57]">
              {config.mode === "native" ? "Modo Nativo" : "Modo HTML Embed"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-[#E7E3EC] shadow-xl min-h-[500px] flex flex-col justify-center">
            {config.mode === "native" ? (
              <div className="flex flex-col gap-4">
                {/* Form Header */}
                <div className="flex flex-col gap-1 border-b border-[#EAE5EF] pb-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#16606B] bg-[#E9F8FA] px-2.5 py-0.5 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E8A9B]" />
                    <span>Paso {selectedStepIndex + 1} de {config.steps.length}</span>
                  </div>
                  <h3 className="text-[17px] font-extrabold text-[#17131F] mt-1 m-0">
                    {activeStep.question}
                  </h3>
                  {activeStep.helperText && (
                    <p className="text-[12px] text-[#5B5266] m-0">{activeStep.helperText}</p>
                  )}
                </div>

                {/* Form Options or Fields Preview */}
                {activeStep.options ? (
                  <div className="flex flex-col gap-2">
                    {activeStep.options.map((opt) => (
                      <div
                        key={opt.value}
                        className="p-3 bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#E7E3EC] rounded-xl text-[13px] font-bold text-[#17131F] flex items-center justify-between cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <div className="w-4 h-4 rounded-full border border-[#C9C1D4]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <input type="text" placeholder="Nombre completo" className="p-2.5 border border-[#C9C1D4] rounded-xl text-[13px]" disabled />
                    <input type="tel" placeholder="Celular a 10 dígitos" className="p-2.5 border border-[#C9C1D4] rounded-xl text-[13px]" disabled />
                    <input type="email" placeholder="Correo electrónico" className="p-2.5 border border-[#C9C1D4] rounded-xl text-[13px]" disabled />
                  </div>
                )}

                {/* Submit / Continue Button Preview */}
                <button
                  type="button"
                  className="w-full py-3 bg-[#5B2C72] text-white font-extrabold text-[13.5px] rounded-full mt-2 shadow-sm"
                >
                  {selectedStepIndex === config.steps.length - 1 ? config.submitBtnText : config.continueBtnText}
                </button>

                {/* Disclaimer */}
                <p className="text-[11px] text-[#8A8095] text-center m-0">
                  {config.privacyText}
                </p>
              </div>
            ) : (
              /* HTML Embed Preview */
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono text-[#8A8095] uppercase">Renderizado de Código HTML:</span>
                <div
                  className="w-full overflow-auto p-4 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC]"
                  dangerouslySetInnerHTML={{ __html: config.htmlEmbedCode || "" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
