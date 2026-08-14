"use client";

import React, { useState, useMemo } from "react";
import { FormSubmissionLog } from "@/lib/telemetry/logger";
import { useTrackingTags } from "@/context/TrackingTagsContext";

interface AudiencesStudioProps {
  submissions: FormSubmissionLog[];
  onRefresh: () => void;
}

type SubModuleTab = "meta_capi" | "google_offline" | "audiences_builder" | "attribution_matrix";

export function AudiencesStudio({ submissions, onRefresh }: AudiencesStudioProps) {
  const { config } = useTrackingTags();
  const [activeSubTab, setActiveSubTab] = useState<SubModuleTab>("meta_capi");

  // Meta CAPI State
  const [metaTestCode, setMetaTestCode] = useState("TEST48291");
  const [metaEventName, setMetaEventName] = useState<"Lead" | "QualifiedLead" | "AgreementAccepted" | "Contact">("Lead");
  const [selectedLeadId, setSelectedLeadId] = useState<string>(submissions[0]?.id || "");
  const [isDispatchingCapi, setIsDispatchingCapi] = useState(false);
  const [capiResponse, setCapiResponse] = useState<any>(null);

  // Google Offline State
  const [googleConversionAction, setGoogleConversionAction] = useState("Bravo_Lead_Calificado");
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);
  const [googleResponse, setGoogleResponse] = useState<any>(null);

  // Audience Filter State
  const [audienceDebtFilter, setAudienceDebtFilter] = useState("all");
  const [audienceStatusFilter, setAudienceStatusFilter] = useState("all");
  const [audienceChannelFilter, setAudienceChannelFilter] = useState("all");

  const selectedLead = useMemo(() => {
    return submissions.find((s) => s.id === selectedLeadId) || submissions[0] || null;
  }, [submissions, selectedLeadId]);

  // Channel Distribution Metrics
  const channelStats = useMemo(() => {
    const counts = {
      meta: 0,
      google: 0,
      tiktok: 0,
      organic: 0,
      direct: 0,
      total: submissions.length,
    };

    submissions.forEach((s) => {
      const channel = s.attribution?.channel || "Directo";
      if (channel === "Meta Ads" || s.attribution?.fbclid || s.attribution?.fbc) counts.meta++;
      else if (channel === "Google Ads" || s.attribution?.gclid) counts.google++;
      else if (channel === "TikTok Ads" || s.attribution?.ttclid) counts.tiktok++;
      else if (channel === "Orgánico") counts.organic++;
      else counts.direct++;
    });

    return counts;
  }, [submissions]);

  // Filtered Leads for Audience Building
  const filteredAudienceLeads = useMemo(() => {
    return submissions.filter((lead) => {
      if (audienceStatusFilter !== "all" && lead.status !== audienceStatusFilter) return false;
      if (audienceDebtFilter !== "all") {
        if (audienceDebtFilter === "high" && !lead.monto.includes("250,000") && !lead.monto.includes("500,000") && !lead.monto.includes("1,000,000")) return false;
        if (audienceDebtFilter === "medium" && !lead.monto.includes("75,000") && !lead.monto.includes("100,000")) return false;
      }
      if (audienceChannelFilter !== "all") {
        const channel = lead.attribution?.channel || "Directo";
        if (audienceChannelFilter === "meta" && channel !== "Meta Ads" && !lead.attribution?.fbclid) return false;
        if (audienceChannelFilter === "google" && channel !== "Google Ads" && !lead.attribution?.gclid) return false;
      }
      return true;
    });
  }, [submissions, audienceDebtFilter, audienceStatusFilter, audienceChannelFilter]);

  // 1. Dispatch Meta CAPI Test / Live Event
  const handleDispatchMetaCapi = async () => {
    if (!selectedLead) return;
    setIsDispatchingCapi(true);
    setCapiResponse(null);

    try {
      const res = await fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testEventCode: metaTestCode || undefined,
          eventName: metaEventName,
          lead: selectedLead,
        }),
      });

      const data = await res.json();
      setCapiResponse(data);
    } catch (err: any) {
      setCapiResponse({ success: false, error: err.message });
    } finally {
      setIsDispatchingCapi(false);
    }
  };

  // 2. Export Meta Ads Custom Audience CSV
  const handleDownloadMetaCsv = () => {
    const headers = "email,phone,fn,ln,country,value\n";
    const rows = filteredAudienceLeads
      .map((lead) => {
        const parts = lead.nombre.trim().split(" ");
        const fn = parts[0] || "";
        const ln = parts.slice(1).join(" ") || "";
        const phone = lead.celular ? `52${lead.celular.replace(/\D/g, "")}` : "";
        const val = lead.monto ? parseInt(lead.monto.replace(/\D/g, ""), 10) || 0 : 0;
        return `"${lead.email || ""}","${phone}","${fn}","${ln}","MX","${val}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meta_custom_audience_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Export Google Ads Offline Conversions CSV
  const handleDownloadGoogleOfflineCsv = () => {
    const headers = "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency\n";
    const rows = filteredAudienceLeads
      .map((lead) => {
        const gclid = lead.attribution?.gclid || "";
        const dateStr = new Date(lead.submittedAt || Date.now()).toISOString().replace("T", " ").substring(0, 19) + "+00:00";
        const val = lead.monto ? parseInt(lead.monto.replace(/\D/g, ""), 10) || 0 : 0;
        return `"${gclid}","${googleConversionAction}","${dateStr}","${val}","MXN"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `google_offline_conversions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 4. Export Google Customer Match CSV
  const handleDownloadGoogleCustomerMatchCsv = () => {
    const headers = "Email,Phone,First Name,Last Name,Country,Zip\n";
    const rows = filteredAudienceLeads
      .map((lead) => {
        const parts = lead.nombre.trim().split(" ");
        const fn = parts[0] || "";
        const ln = parts.slice(1).join(" ") || "";
        const phone = lead.celular ? `+52${lead.celular.replace(/\D/g, "")}` : "";
        return `"${lead.email || ""}","${phone}","${fn}","${ln}","MX",""`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `google_customer_match_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5B2C72] bg-[#FAF5FC] px-2.5 py-0.5 rounded-full border border-[#DDCBE6]">
              Atribución & CAPI v19.0
            </span>
            <span className="text-[12px] text-[#8A8095]">
              {submissions.length} Prospectos Registrados
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0 mt-1">
            Audiencias y Retorno de Atribución
          </h2>
          <p className="text-[14px] text-[#5B5266] m-0">
            Sincronización server-to-server (Meta CAPI), retorno de conversiones offline a Google Ads y exportación de audiencias CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 bg-white hover:bg-[#FAF8FB] text-[#5B2C72] border border-[#C9C1D4] rounded-full shadow-2xs transition-all cursor-pointer"
            title="Actualizar datos"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sub-module Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAF8FB] border border-[#E7E3EC] rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveSubTab("meta_capi")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13.5px] transition-all cursor-pointer ${
            activeSubTab === "meta_capi"
              ? "bg-[#5B2C72] text-white shadow-sm"
              : "text-[#5B5266] hover:text-[#17131F] hover:bg-white"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-[#1877F2]" />
          <span>Meta Conversions API (CAPI)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("google_offline")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13.5px] transition-all cursor-pointer ${
            activeSubTab === "google_offline"
              ? "bg-[#5B2C72] text-white shadow-sm"
              : "text-[#5B5266] hover:text-[#17131F] hover:bg-white"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
          <span>Google Ads Conversiones Offline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("audiences_builder")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13.5px] transition-all cursor-pointer ${
            activeSubTab === "audiences_builder"
              ? "bg-[#5B2C72] text-white shadow-sm"
              : "text-[#5B5266] hover:text-[#17131F] hover:bg-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Segmentador de Audiencias CRM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("attribution_matrix")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13.5px] transition-all cursor-pointer ${
            activeSubTab === "attribution_matrix"
              ? "bg-[#5B2C72] text-white shadow-sm"
              : "text-[#5B5266] hover:text-[#17131F] hover:bg-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Matriz de Atribución Multi-Canal</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MÓDULO 1: Meta Conversions API (CAPI) */}
      {/* ========================================================================= */}
      {activeSubTab === "meta_capi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): CAPI Dispatcher & Configuration */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-4">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17131F] m-0 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
                    <span>Emisor Server-to-Server Meta CAPI</span>
                  </h3>
                  <p className="text-[13px] text-[#5B5266] m-0">
                    Dispara eventos offline o calificados directamente al Graph API v19.0 de Meta sin pasar por bloqueadores de anuncios.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#E6F4FE] text-[#026AA2] px-2.5 py-1 rounded-full border border-[#B9E6FE]">
                  SHA-256 Activo
                </span>
              </div>

              {/* Parameter Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12.5px] font-bold text-[#17131F] mb-1">
                    Test Event Code (Opcional):
                  </label>
                  <input
                    type="text"
                    value={metaTestCode}
                    onChange={(e) => setMetaTestCode(e.target.value)}
                    placeholder="Ej: TEST12345"
                    className="w-full px-3.5 py-2.5 border border-[#C9C1D4] rounded-xl text-[13.5px] font-mono bg-[#FAF8FB] focus:bg-white focus:outline-none focus:border-[#5B2C72]"
                  />
                </div>
              </div>

              {/* Event & Lead Selection */}
              <div className="border-t border-[#F0EDF3] pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12.5px] font-bold text-[#17131F] mb-1">
                      Evento Estándar CAPI:
                    </label>
                    <select
                      value={metaEventName}
                      onChange={(e) => setMetaEventName(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border border-[#C9C1D4] rounded-xl text-[13.5px] font-bold bg-white focus:outline-none focus:border-[#5B2C72]"
                    >
                      <option value="Lead">Lead (Prospecto Precalificado)</option>
                      <option value="QualifiedLead">QualifiedLead (Lead Verificado)</option>
                      <option value="AgreementAccepted">AgreementAccepted (Convenio Aceptado)</option>
                      <option value="Contact">Contact (Interacción WhatsApp / Asesor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-bold text-[#17131F] mb-1">
                      Seleccionar Expediente:
                    </label>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[#C9C1D4] rounded-xl text-[13.5px] bg-white focus:outline-none focus:border-[#5B2C72]"
                    >
                      {submissions.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.folio} · {lead.nombre} ({lead.monto})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Lead Preview Card */}
                {selectedLead && (
                  <div className="p-4 bg-[#FAF5FC] border border-[#DDCBE6] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-mono font-bold text-[#5B2C72]">
                          {selectedLead.folio}
                        </span>
                        <span className="text-[13.5px] font-bold text-[#17131F]">
                          {selectedLead.nombre}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#5B5266]">
                        {selectedLead.institucion} · {selectedLead.monto} · Tel: {selectedLead.celular}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-[#8A8095]">
                          FBC: {selectedLead.attribution?.fbc ? "Presente" : "Generado"} · FBP: {selectedLead.attribution?.fbp ? "Presente" : "Generado"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isDispatchingCapi}
                      onClick={handleDispatchMetaCapi}
                      className="px-5 py-2.5 bg-[#1877F2] hover:bg-[#0D65D9] text-white font-extrabold text-[13.5px] rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isDispatchingCapi ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Disparar Evento CAPI</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): CAPI Live Response & Payload Inspector */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#170B1F] text-white rounded-[24px] p-6 border border-[#341C3D] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#341C3D] pb-3">
                <span className="text-[13px] font-mono font-bold text-[#5ECBDB] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5ECBDB] animate-pulse" />
                  <span>Respuesta Graph API Meta</span>
                </span>
                {capiResponse && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      capiResponse.success
                        ? "bg-[#157A5A]/30 text-[#42DFAC] border border-[#157A5A]"
                        : "bg-[#DF1C41]/30 text-[#FF6B8B] border border-[#DF1C41]"
                    }`}
                  >
                    HTTP {capiResponse.status || (capiResponse.success ? 200 : 500)}
                  </span>
                )}
              </div>

              {capiResponse ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-xl bg-[#24102F] text-[12px] font-mono text-[#D4C8DF] border border-[#48205C] overflow-x-auto max-h-[300px]">
                    <pre>{JSON.stringify(capiResponse, null, 2)}</pre>
                  </div>
                  <span className="text-[11.5px] text-[#A594B5]">
                    {capiResponse.note || "Evento transmitido exitosamente con User Data SHA-256 y FBC/FBP cookies."}
                  </span>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center text-[#8A799B] gap-2">
                  <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[13px]">Selecciona un expediente y presiona "Disparar Evento CAPI" para ver la respuesta del servidor en tiempo real.</span>
                </div>
              )}
            </div>

            {/* CAPI Parameter Standard Guide */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E7E3EC] shadow-xs flex flex-col gap-3">
              <h4 className="text-[13.5px] font-extrabold text-[#17131F] m-0">
                Parámetros Oficiales Meta Conversions API
              </h4>
              <div className="flex flex-col gap-2 text-[12px] text-[#5B5266]">
                <div className="flex justify-between py-1 border-b border-[#F0EDF3]">
                  <span className="font-mono text-[#5B2C72]">em</span>
                  <span>Correo electrónico hasheado con SHA-256</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0EDF3]">
                  <span className="font-mono text-[#5B2C72]">ph</span>
                  <span>Teléfono con código de país +52 (SHA-256)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0EDF3]">
                  <span className="font-mono text-[#5B2C72]">fbc</span>
                  <span>Click ID formato fb.1.timestamp.fbclid</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0EDF3]">
                  <span className="font-mono text-[#5B2C72]">fbp</span>
                  <span>Cookie de navegador fb.1.timestamp.rand</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-mono text-[#5B2C72]">external_id</span>
                  <span>Folio único de solicitud (Deduplicación)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MÓDULO 2: Google Ads Conversiones Offline */}
      {/* ========================================================================= */}
      {activeSubTab === "google_offline" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-4">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#17131F] m-0 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                    <span>Retorno de Conversiones Offline a Google Ads</span>
                  </h3>
                  <p className="text-[13px] text-[#5B5266] m-0">
                    Sincroniza prospectos cerrados o calificados con el algoritmo de Google Ads Smart Bidding usando su GCLID, GBRAID o WBRAID.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#E8F0FE] text-[#1967D2] px-2.5 py-1 rounded-full border border-[#D2E3FC]">
                  GCLID Tracking
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[12.5px] font-bold text-[#17131F] mb-1">
                    Nombre de la Acción de Conversión en Google Ads:
                  </label>
                  <input
                    type="text"
                    value={googleConversionAction}
                    onChange={(e) => setGoogleConversionAction(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#C9C1D4] rounded-xl text-[13.5px] font-mono bg-[#FAF8FB] focus:bg-white focus:outline-none focus:border-[#5B2C72]"
                  />
                  <span className="text-[11.5px] text-[#8A8095] mt-1 block">
                    Debe coincidir exactamente con el nombre de la acción creada en tu cuenta de Google Ads (Herramientas &gt; Conversiones &gt; Cargas).
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={handleDownloadGoogleOfflineCsv}
                    className="px-5 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-extrabold text-[13.5px] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Descargar Conversiones Offline CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadGoogleCustomerMatchCsv}
                    className="px-5 py-3 bg-[#FAF8FB] hover:bg-[#F5EDF9] text-[#5B2C72] border border-[#C9C1D4] font-bold text-[13.5px] rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Google Customer Match CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
              <h4 className="text-[14px] font-extrabold text-[#17131F] m-0">
                Variables de Atribución Google Ads
              </h4>
              <div className="flex flex-col gap-2.5 text-[12px] text-[#5B5266]">
                <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] flex flex-col gap-1">
                  <span className="font-bold text-[#17131F]">gclid (Google Click ID)</span>
                  <span className="text-[#8A8095]">Parámetro generado automáticamente en URLs para campañas de Search, PMax y Display.</span>
                </div>
                <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] flex flex-col gap-1">
                  <span className="font-bold text-[#17131F]">gbraid &amp; wbraid</span>
                  <span className="text-[#8A8095]">Identificadores de medición agregada para tráfico de iOS 14.5+ respetando App Tracking Transparency.</span>
                </div>
                <div className="p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC] flex flex-col gap-1">
                  <span className="font-bold text-[#17131F]">_ga Client ID</span>
                  <span className="text-[#8A8095]">Identificador único de usuario de Google Analytics 4 para deduplicación cross-device.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MÓDULO 3: Segmentador de Audiencias CRM */}
      {/* ========================================================================= */}
      {activeSubTab === "audiences_builder" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F0EDF3] pb-4">
              <div>
                <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">
                  Constructor de Audiencias y Listas de Clientes
                </h3>
                <p className="text-[13px] text-[#5B5266] m-0">
                  Crea segmentos de alta conversión para alimentar campañas Lookalike (Públicos Similares) y Retargeting en Meta y Google.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadMetaCsv}
                  className="px-4 py-2 bg-[#1877F2] hover:bg-[#0D65D9] text-white font-extrabold text-[13px] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Exportar Meta Audience ({filteredAudienceLeads.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGoogleCustomerMatchCsv}
                  className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white font-extrabold text-[13px] rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Exportar Google Match ({filteredAudienceLeads.length})</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF8FB] p-4 rounded-2xl border border-[#E7E3EC]">
              <div>
                <label className="block text-[12px] font-bold text-[#17131F] mb-1">
                  Monto de Deuda:
                </label>
                <select
                  value={audienceDebtFilter}
                  onChange={(e) => setAudienceDebtFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C9C1D4] rounded-xl text-[13px] bg-white focus:outline-none focus:border-[#5B2C72]"
                >
                  <option value="all">Todos los montos</option>
                  <option value="high">Deuda Alta (&gt; $250,000 MXN)</option>
                  <option value="medium">Deuda Media ($75k – $250k MXN)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17131F] mb-1">
                  Estado del Expediente:
                </label>
                <select
                  value={audienceStatusFilter}
                  onChange={(e) => setAudienceStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C9C1D4] rounded-xl text-[13px] bg-white focus:outline-none focus:border-[#5B2C72]"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Convenio Aceptado">Convenio Aceptado (Cerrados)</option>
                  <option value="Contactado">Contactado</option>
                  <option value="En Análisis">En Análisis</option>
                  <option value="Nuevo">Nuevo</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17131F] mb-1">
                  Canal de Origen:
                </label>
                <select
                  value={audienceChannelFilter}
                  onChange={(e) => setAudienceChannelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#C9C1D4] rounded-xl text-[13px] bg-white focus:outline-none focus:border-[#5B2C72]"
                >
                  <option value="all">Todos los canales</option>
                  <option value="meta">Meta Ads (Facebook / Instagram)</option>
                  <option value="google">Google Ads (Search / PMax)</option>
                </select>
              </div>
            </div>

            {/* Segmented Leads Table Preview */}
            <div className="overflow-x-auto border border-[#E7E3EC] rounded-xl">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#FAF8FB] text-[#8A8095] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7E3EC]">
                  <tr>
                    <th className="p-3.5">Folio</th>
                    <th className="p-3.5">Titular</th>
                    <th className="p-3.5">Institución / Monto</th>
                    <th className="p-3.5">Canal Atribuido</th>
                    <th className="p-3.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDF3]">
                  {filteredAudienceLeads.slice(0, 10).map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF5FC] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#5B2C72]">{lead.folio}</td>
                      <td className="p-3.5 font-bold text-[#17131F]">{lead.nombre}</td>
                      <td className="p-3.5 text-[#5B5266]">{lead.institucion} · {lead.monto}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF8FB] border border-[#C9C1D4] text-[#17131F]">
                          {lead.attribution?.channel || "Directo"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-[#F1FAF6] text-[#157A5A] border border-[#C6E6D9]">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MÓDULO 4: Matriz de Atribución Multi-Canal */}
      {/* ========================================================================= */}
      {activeSubTab === "attribution_matrix" && (
        <div className="flex flex-col gap-6">
          {/* Channel Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#8A8095]">Meta Ads</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
              </div>
              <span className="text-[26px] font-black text-[#17131F] tracking-tight">{channelStats.meta}</span>
              <span className="text-[11.5px] text-[#5B5266]">Facebook &amp; Instagram Ads</span>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#8A8095]">Google Ads</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              </div>
              <span className="text-[26px] font-black text-[#17131F] tracking-tight">{channelStats.google}</span>
              <span className="text-[11.5px] text-[#5B5266]">Search, PMax &amp; YouTube</span>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#8A8095]">TikTok Ads</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE2C55]" />
              </div>
              <span className="text-[26px] font-black text-[#17131F] tracking-tight">{channelStats.tiktok}</span>
              <span className="text-[11.5px] text-[#5B5266]">TikTok Feed Ads</span>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#8A8095]">Orgánico</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#157A5A]" />
              </div>
              <span className="text-[26px] font-black text-[#17131F] tracking-tight">{channelStats.organic}</span>
              <span className="text-[11.5px] text-[#5B5266]">Google Search SEO</span>
            </div>

            <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#8A8095]">Directo</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A8095]" />
              </div>
              <span className="text-[26px] font-black text-[#17131F] tracking-tight">{channelStats.direct}</span>
              <span className="text-[11.5px] text-[#5B5266]">Tráfico directo / URLs</span>
            </div>
          </div>

          {/* Detailed Attribution Table */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E7E3EC] shadow-sm flex flex-col gap-4">
            <h3 className="text-[17px] font-extrabold text-[#17131F] m-0">
              Desglose de Parámetros por Expediente
            </h3>

            <div className="overflow-x-auto border border-[#E7E3EC] rounded-xl">
              <table className="w-full text-left text-[12.5px]">
                <thead className="bg-[#FAF8FB] text-[#8A8095] text-[11px] font-bold uppercase tracking-wider border-b border-[#E7E3EC]">
                  <tr>
                    <th className="p-3">Folio</th>
                    <th className="p-3">Titular</th>
                    <th className="p-3">Canal</th>
                    <th className="p-3">Click ID (GCLID / FBCLID)</th>
                    <th className="p-3">First-Party Cookies (_fbc / _fbp / _ga)</th>
                    <th className="p-3">Campaña / UTMs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDF3] font-mono">
                  {submissions.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF5FC] transition-colors">
                      <td className="p-3 font-bold text-[#5B2C72]">{lead.folio}</td>
                      <td className="p-3 font-sans font-bold text-[#17131F]">{lead.nombre}</td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F0EDF3] text-[#17131F]">
                          {lead.attribution?.channel || "Directo"}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-[#5B5266] max-w-[200px] truncate">
                        {lead.attribution?.gclid ? `gclid: ${lead.attribution.gclid}` : lead.attribution?.fbclid ? `fbclid: ${lead.attribution.fbclid}` : "Sin Click ID"}
                      </td>
                      <td className="p-3 text-[11px] text-[#5B5266] max-w-[240px] truncate">
                        {lead.attribution?.fbc ? `_fbc: ${lead.attribution.fbc.slice(0, 18)}...` : lead.attribution?.fbp ? `_fbp: ${lead.attribution.fbp}` : "_ga: Auto"}
                      </td>
                      <td className="p-3 text-[11px] text-[#5B5266]">
                        {lead.attribution?.utm_campaign || lead.attribution?.utm_source || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
