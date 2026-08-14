"use client";

import React, { useState, useMemo } from "react";
import { FormSubmissionLog, ApiPlatformSyncStatus } from "@/lib/telemetry/logger";

interface RecordsManagerProps {
  submissions: FormSubmissionLog[];
  onStatusChange: (id: string, newStatus: FormSubmissionLog["status"]) => void;
  onRefresh: () => void;
}

export function RecordsManager({
  submissions,
  onStatusChange,
  onRefresh,
}: RecordsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [channelFilter, setChannelFilter] = useState("Todos");
  const [institutionFilter, setInstitutionFilter] = useState("Todas");
  const [selectedLead, setSelectedLead] = useState<FormSubmissionLog | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Unique Institutions list
  const institutions = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.institucion) set.add(s.institucion);
    });
    return ["Todas", ...Array.from(set)];
  }, [submissions]);

  // Filtered Leads
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesSearch =
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.celular.includes(searchQuery) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "Todos" ? true : item.status === statusFilter;

      const matchesInstitution =
        institutionFilter === "Todas" ? true : item.institucion === institutionFilter;

      const channel = item.attribution?.channel || "Directo";
      const matchesChannel =
        channelFilter === "Todos" ? true : channel === channelFilter;

      return matchesSearch && matchesStatus && matchesInstitution && matchesChannel;
    });
  }, [submissions, searchQuery, statusFilter, institutionFilter, channelFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = "Folio,Titular,Institucion,Tipo Deuda,Monto,Celular,Email,Estado,Canal,Meta_CAPI_Status,Google_Ads_Status,CRM_Status,Fecha,Dispositivo\n";
    const rows = submissions
      .map(
        (l) =>
          `"${l.folio}","${l.nombre}","${l.institucion}","${l.tipoDeuda}","${l.monto}","${l.celular}","${l.email || ""}","${l.status}","${l.attribution?.channel || "Directo"}","${l.api_sync_logs?.meta_capi?.status || "success"}","${l.api_sync_logs?.google_ads?.status || "success"}","${l.api_sync_logs?.crm_webhook?.status || "none"}","${new Date(l.submittedAt).toLocaleString("es-MX")}","${l.device || "Escritorio"}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expedientes_bravo_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getStatusBadge = (status: FormSubmissionLog["status"]) => {
    switch (status) {
      case "Nuevo":
        return "bg-[#E6F4FE] text-[#026AA2] border-[#B9E6FE]";
      case "En Análisis":
        return "bg-[#FFF9E6] text-[#B54708] border-[#FEDF89]";
      case "Contactado":
        return "bg-[#F5EDF9] text-[#5B2C72] border-[#DDCBE6]";
      case "Convenio Aceptado":
        return "bg-[#F1FAF6] text-[#157A5A] border-[#C6E6D9]";
      default:
        return "bg-[#F8F9FA] text-[#5B5266] border-[#E7E3EC]";
    }
  };

  const getChannelBadge = (channel?: string) => {
    switch (channel) {
      case "Meta Ads":
        return "bg-[#E7F0FE] text-[#1877F2] border-[#C2D8FC]";
      case "Google Ads":
        return "bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]";
      case "TikTok Ads":
        return "bg-[#FEEBF0] text-[#FE2C55] border-[#FDC2D2]";
      case "Orgánico":
        return "bg-[#F1FAF6] text-[#157A5A] border-[#C6E6D9]";
      default:
        return "bg-[#FAF8FB] text-[#5B5266] border-[#E7E3EC]";
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleString("es-MX", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Helper for compact Table row checkbox indicator
  const renderTableCheckbox = (sync?: ApiPlatformSyncStatus, label?: string) => {
    const isSuccess = !sync || sync.status === "success";
    const isFailed = sync?.status === "failed";
    const isNone = sync?.status === "none";

    if (isNone) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#FAF8FB] border border-[#E7E3EC] text-[#8A8095] text-[10px] font-mono" title={`${label}: No configurado`}>
          -
        </span>
      );
    }

    if (isFailed) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#FEF3F2] border border-[#FECDCA] text-[#D92D20]" title={`${label}: Fallo de envío`}>
          <svg className="w-3 h-3 text-[#D92D20]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A]" title={`${label}: Enviado con éxito`}>
        <svg className="w-3 h-3 text-[#157A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#157A5A] bg-[#F1FAF6] px-2.5 py-0.5 rounded-full border border-[#C6E6D9]">
              Sistema Sincronizado
            </span>
            <span className="text-[12px] text-[#8A8095]">
              {submissions.length} Solicitudes Totales
            </span>
          </div>
          <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0 mt-1">
            Revisión de Expedientes y Prospectos
          </h2>
          <p className="text-[14px] text-[#5B5266] m-0">
            Control integral de prospectos, verificación de contacto y estatus de envío autónomo a Meta CAPI, Google Ads y CRM.
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

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8FB] text-[#5B2C72] border border-[#C9C1D4] font-bold text-[14px] px-4 py-2.5 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Descargar CSV Completo</span>
          </button>
        </div>
      </div>

      {/* Main Records Container */}
      <div className="bg-white rounded-[24px] border border-[#E7E3EC] shadow-sm overflow-hidden flex flex-col">
        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#E7E3EC] flex flex-col gap-4 bg-[#FAF8FB]">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            {/* Search Box */}
            <div className="relative flex-grow max-w-[420px]">
              <input
                type="text"
                placeholder="Buscar por nombre, folio, banco, celular o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#C9C1D4] rounded-xl text-[13.5px] bg-white focus:outline-none focus:border-[#5B2C72] shadow-2xs"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8095]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Institution Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold text-[#17131F] shrink-0">Institución:</span>
                <select
                  value={institutionFilter}
                  onChange={(e) => setInstitutionFilter(e.target.value)}
                  className="px-3 py-2 border border-[#C9C1D4] rounded-xl text-[13px] font-bold bg-white focus:outline-none focus:border-[#5B2C72]"
                >
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold text-[#17131F] shrink-0">Canal:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-3 py-2 border border-[#C9C1D4] rounded-xl text-[13px] font-bold bg-white focus:outline-none focus:border-[#5B2C72]"
                >
                  <option value="Todos">Todos los canales</option>
                  <option value="Meta Ads">Meta Ads (Facebook/IG)</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="Orgánico">Orgánico</option>
                  <option value="Directo">Directo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E7E3EC]">
            {["Todos", "Nuevo", "En Análisis", "Contactado", "Convenio Aceptado"].map((status) => {
              const count = submissions.filter((s) => status === "Todos" || s.status === status).length;
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#5B2C72] text-white shadow-xs"
                      : "bg-white text-[#5B5266] hover:bg-[#F5EDF9] hover:text-[#5B2C72] border border-[#E7E3EC]"
                  }`}
                >
                  <span>{status}</span>
                  <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-[#FAF8FB] text-[#8A8095]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Table for Desktop & Large Viewports */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E3EC] bg-[#FAF8FB] text-[#8A8095] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4 font-extrabold">Folio / Fecha</th>
                <th className="py-3.5 px-4 font-extrabold">Titular / Contacto</th>
                <th className="py-3.5 px-4 font-extrabold">Institución / Deuda</th>
                <th className="py-3.5 px-4 font-extrabold">Monto</th>
                <th className="py-3.5 px-4 font-extrabold">Atribución</th>
                <th className="py-3.5 px-4 font-extrabold">Estado</th>
                <th className="py-3.5 px-4 font-extrabold text-right">Acciones &amp; Envío APIs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3EC] text-[13.5px]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A8095]">
                    No se encontraron expedientes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8FB] transition-colors group">
                    {/* Folio & Date */}
                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold text-[#17131F] block">{item.folio}</span>
                      <span className="text-[11.5px] text-[#8A8095] block">{formatDateTime(item.submittedAt)}</span>
                    </td>

                    {/* Titular & Contact */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#17131F] block">{item.nombre}</span>
                      <span className="text-[12px] text-[#5B5266] font-mono block">{item.celular}</span>
                      {item.email && <span className="text-[11.5px] text-[#8A8095] block truncate max-w-[180px]">{item.email}</span>}
                    </td>

                    {/* Institution & Debt Type */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#5B2C72] block">{item.institucion}</span>
                      <span className="text-[12px] text-[#5B5266] block">{item.tipoDeuda}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-bold text-[#157A5A]">
                      {item.monto}
                    </td>

                    {/* Attribution Channel */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getChannelBadge(item.attribution?.channel)}`}>
                        <span>{item.attribution?.channel || "Directo"}</span>
                        {item.attribution?.gclid && <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" title="GCLID presente" />}
                        {item.attribution?.fbclid && <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" title="FBCLID presente" />}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onStatusChange(item.id, e.target.value as any)}
                        className={`text-[12px] font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(item.status)}`}
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="En Análisis">En Análisis</option>
                        <option value="Contactado">Contactado</option>
                        <option value="Convenio Aceptado">Convenio Aceptado</option>
                        <option value="Archivado">Archivado</option>
                      </select>
                    </td>

                    {/* Actions & Platform Checkbox Badge Strip (Right side of Expediente) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* WhatsApp Direct Action */}
                        <a
                          href={`https://wa.me/52${item.celular.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(item.nombre)},%20te%20escribimos%20de%20Bravo%20M%C3%A9xico%20para%20dar%20seguimiento%20a%20tu%20folio%20${item.folio}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-[#F1FAF6] hover:bg-[#E2F7EE] text-[#157A5A] border border-[#C6E6D9] rounded-xl transition-colors shrink-0"
                          title="Contactar por WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </a>

                        {/* View Dossier Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedLead(item)}
                          className="px-3.5 py-1.5 bg-[#FAF8FB] hover:bg-[#F5EDF9] text-[#5B2C72] border border-[#C9C1D4] font-bold text-[12.5px] rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          Expediente →
                        </button>

                        {/* Checkbox Platform Indicators: Placed on the right side of Expediente */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E7E3EC] rounded-xl shadow-2xs shrink-0" title="Estatus de envío autónomo a plataformas (Meta CAPI, Google Ads, CRM)">
                          <div className="flex items-center gap-1" title="Meta CAPI">
                            <span className="w-4 h-4 rounded bg-[#E6F4FE] text-[#1877F2] flex items-center justify-center text-[9px] font-black">f</span>
                            {renderTableCheckbox(item.api_sync_logs?.meta_capi, "Meta CAPI")}
                          </div>
                          <div className="flex items-center gap-1" title="Google Ads">
                            <span className="w-4 h-4 rounded bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center text-[9px] font-black">G</span>
                            {renderTableCheckbox(item.api_sync_logs?.google_ads, "Google Ads")}
                          </div>
                          <div className="flex items-center gap-1" title="CRM Webhook">
                            <span className="w-4 h-4 rounded bg-[#FAF5FC] text-[#5B2C72] flex items-center justify-center text-[8.5px] font-bold">API</span>
                            {renderTableCheckbox(item.api_sync_logs?.crm_webhook, "CRM Webhook")}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Dossier Detail Drawer / Modal with Horizontal Platform Checkbox Cards */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-[880px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E3EC] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E7E3EC] flex justify-between items-center bg-[#FAF8FB] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5B2C72] text-white flex items-center justify-center font-bold text-[16px]">
                  {selectedLead.nombre.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-extrabold text-[#17131F]">
                      {selectedLead.nombre}
                    </span>
                    <span className="font-mono text-[12px] font-bold text-[#5B2C72] bg-[#FAF5FC] px-2.5 py-0.5 rounded-full border border-[#DDCBE6]">
                      {selectedLead.folio}
                    </span>
                  </div>
                  <span className="text-[12.5px] text-[#5B5266]">
                    Registrado el {formatDateTime(selectedLead.submittedAt)} · {selectedLead.device || "Escritorio"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F5EDF9] text-[#5B5266] hover:text-[#17131F] border border-[#C9C1D4] flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar expediente"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-6">
              {/* Financial & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC]">
                  <span className="text-[11.5px] font-bold text-[#8A8095] uppercase block mb-1">Monto de Deuda</span>
                  <span className="text-[17px] font-extrabold text-[#157A5A]">{selectedLead.monto}</span>
                </div>

                <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC]">
                  <span className="text-[11.5px] font-bold text-[#8A8095] uppercase block mb-1">Institución / Producto</span>
                  <span className="text-[15px] font-bold text-[#5B2C72] block">{selectedLead.institucion}</span>
                  <span className="text-[12px] text-[#5B5266]">{selectedLead.tipoDeuda}</span>
                </div>

                <div className="p-4 bg-[#FAF8FB] rounded-2xl border border-[#E7E3EC]">
                  <span className="text-[11.5px] font-bold text-[#8A8095] uppercase block mb-1">Estado de Gestión</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      onStatusChange(selectedLead.id, newStatus);
                      setSelectedLead({ ...selectedLead, status: newStatus });
                    }}
                    className={`w-full text-[12.5px] font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${getStatusBadge(selectedLead.status)}`}
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="En Análisis">En Análisis</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Convenio Aceptado">Convenio Aceptado</option>
                    <option value="Archivado">Archivado</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-5 bg-white rounded-2xl border border-[#E7E3EC] shadow-2xs flex flex-col gap-3">
                <h4 className="text-[14px] font-extrabold text-[#17131F] m-0">Canales de Contacto Directo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC]">
                    <div>
                      <span className="text-[11px] text-[#8A8095] block">Teléfono / WhatsApp</span>
                      <span className="font-mono font-bold text-[#17131F]">{selectedLead.celular}</span>
                    </div>
                    <a
                      href={`https://wa.me/52${selectedLead.celular.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#157A5A] hover:bg-[#106247] text-white font-bold text-[12px] rounded-lg transition-colors"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF8FB] rounded-xl border border-[#E7E3EC]">
                    <div>
                      <span className="text-[11px] text-[#8A8095] block">Correo Electrónico</span>
                      <span className="font-mono text-[#17131F] truncate max-w-[180px] block">{selectedLead.email || "No proporcionado"}</span>
                    </div>
                    {selectedLead.email && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedLead.email, "email")}
                        className="px-3 py-1.5 bg-white hover:bg-[#FAF8FB] text-[#5B2C72] border border-[#C9C1D4] font-bold text-[12px] rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedField === "email" ? "Copiado!" : "Copiar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* ESTATUS DE ENVÍO A PLATAFORMAS (HORIZONTAL - TIPO CHECKBOX - TÍTULOS SUPERIORES) */}
              {/* ========================================================================= */}
              <div className="p-5 bg-white rounded-2xl border border-[#E7E3EC] shadow-2xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-3">
                  <div>
                    <h4 className="text-[14.5px] font-extrabold text-[#17131F] m-0 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#157A5A]" />
                      <span>Estatus de Envío Autónomo a Plataformas</span>
                    </h4>
                    <p className="text-[12px] text-[#5B5266] m-0">
                      Trazabilidad y confirmación de recepción en tiempo real por cada servicio publicitario y CRM.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-[#FAF5FC] text-[#5B2C72] border border-[#DDCBE6] px-2.5 py-1 rounded-full">
                    Sincronización Automática
                  </span>
                </div>

                {/* HORIZONTAL 3-COLUMN GRID WITH UPPER TITLES & CHECKBOX STYLE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Platform 1: Meta Conversions API (CAPI) */}
                  {(() => {
                    const metaLog = selectedLead.api_sync_logs?.meta_capi;
                    const isSuccess = !metaLog || metaLog.status === "success";
                    const isFailed = metaLog?.status === "failed";
                    const sendDate = metaLog?.sentAt || selectedLead.submittedAt;

                    return (
                      <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isFailed ? "bg-[#FFF5F5] border-[#FECDCA]" : "bg-[#FAF8FB] border-[#E7E3EC]"
                      }`}>
                        {/* Title at top */}
                        <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#1877F2] text-white flex items-center justify-center font-black text-[11px]">
                              f
                            </span>
                            <span className="font-extrabold text-[12.5px] text-[#17131F]">Meta CAPI v19.0</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8A8095] font-bold uppercase">Graph API</span>
                        </div>

                        {/* Checkbox Style Status Indicator */}
                        <div className="flex items-center gap-2.5 py-1">
                          {isSuccess ? (
                            <div className="w-5 h-5 rounded-md bg-[#157A5A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md bg-[#D92D20] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          <span className={`text-[12.5px] font-extrabold ${
                            isSuccess ? "text-[#157A5A]" : "text-[#D92D20]"
                          }`}>
                            {isSuccess ? "Realizado con éxito" : "Fallo de envío"}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11.5px] text-[#5B5266] flex flex-col gap-0.5">
                          <span className="text-[10.5px] text-[#8A8095]">Fecha / Hora de envío:</span>
                          <span className="font-bold text-[#17131F]">{formatDateTime(sendDate)}</span>
                        </div>

                        {/* If Error: Dynamic Comment Box */}
                        {isFailed && (
                          <div className="mt-1 p-2.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-[11.5px] text-[#B42318] flex flex-col gap-1">
                            <span className="font-bold">Comentario de la API:</span>
                            <span className="font-mono text-[11px] leading-tight">
                              {metaLog?.responseMessage || "Error 400: Fallo de autenticación en Meta Graph API."}
                            </span>
                          </div>
                        )}

                        {isSuccess && (
                          <div className="text-[11px] text-[#5B5266] bg-white p-2 rounded-xl border border-[#F0EDF3] flex flex-col gap-0.5">
                            <span><strong>Status:</strong> HTTP 200 OK</span>
                            <span><strong>Payload:</strong> SHA-256 (Email/Tel)</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Platform 2: Google Ads Conversions */}
                  {(() => {
                    const googleLog = selectedLead.api_sync_logs?.google_ads;
                    const isSuccess = !googleLog || googleLog.status === "success";
                    const isFailed = googleLog?.status === "failed";
                    const sendDate = googleLog?.sentAt || selectedLead.submittedAt;

                    return (
                      <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isFailed ? "bg-[#FFF5F5] border-[#FECDCA]" : "bg-[#FAF8FB] border-[#E7E3EC]"
                      }`}>
                        {/* Title at top */}
                        <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#4285F4] text-white flex items-center justify-center font-black text-[11px]">
                              G
                            </span>
                            <span className="font-extrabold text-[12.5px] text-[#17131F]">Google Ads</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8A8095] font-bold uppercase">Smart Bidding</span>
                        </div>

                        {/* Checkbox Style Status Indicator */}
                        <div className="flex items-center gap-2.5 py-1">
                          {isSuccess ? (
                            <div className="w-5 h-5 rounded-md bg-[#157A5A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md bg-[#D92D20] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          )}
                          <span className={`text-[12.5px] font-extrabold ${
                            isSuccess ? "text-[#157A5A]" : "text-[#D92D20]"
                          }`}>
                            {isSuccess ? "Realizado con éxito" : "Fallo de envío"}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11.5px] text-[#5B5266] flex flex-col gap-0.5">
                          <span className="text-[10.5px] text-[#8A8095]">Fecha / Hora de envío:</span>
                          <span className="font-bold text-[#17131F]">{formatDateTime(sendDate)}</span>
                        </div>

                        {/* If Error: Dynamic Comment Box */}
                        {isFailed && (
                          <div className="mt-1 p-2.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-[11.5px] text-[#B42318] flex flex-col gap-1">
                            <span className="font-bold">Comentario de la API:</span>
                            <span className="font-mono text-[11px] leading-tight">
                              {googleLog?.responseMessage || "Error: Fallo al registrar conversión en Google Ads."}
                            </span>
                          </div>
                        )}

                        {isSuccess && (
                          <div className="text-[11px] text-[#5B5266] bg-white p-2 rounded-xl border border-[#F0EDF3] flex flex-col gap-0.5">
                            <span><strong>Acción:</strong> Bravo_Lead_Calificado</span>
                            <span><strong>GCLID:</strong> {selectedLead.attribution?.gclid ? "Vinculado" : "Directo/Org"}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Platform 3: CRM / Webhook Externo */}
                  {(() => {
                    const crmLog = selectedLead.api_sync_logs?.crm_webhook;
                    const hasCrm = crmLog && crmLog.status !== "none";
                    const isSuccess = crmLog?.status === "success";
                    const isFailed = crmLog?.status === "failed";
                    const sendDate = crmLog?.sentAt || selectedLead.submittedAt;

                    return (
                      <div className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isFailed ? "bg-[#FFF5F5] border-[#FECDCA]" : "bg-[#FAF8FB] border-[#E7E3EC]"
                      }`}>
                        {/* Title at top */}
                        <div className="flex items-center justify-between border-b border-[#F0EDF3] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#5B2C72] text-white flex items-center justify-center font-bold text-[10px]">
                              API
                            </span>
                            <span className="font-extrabold text-[12.5px] text-[#17131F]">CRM Webhook</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8A8095] font-bold uppercase">Reenvío</span>
                        </div>

                        {/* Checkbox Style Status Indicator */}
                        <div className="flex items-center gap-2.5 py-1">
                          {!hasCrm ? (
                            <>
                              <div className="w-5 h-5 rounded-md bg-[#E7E3EC] text-[#8A8095] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                                -
                              </div>
                              <span className="text-[12.5px] font-bold text-[#8A8095]">
                                No requerido
                              </span>
                            </>
                          ) : isSuccess ? (
                            <>
                              <div className="w-5 h-5 rounded-md bg-[#157A5A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[12.5px] font-extrabold text-[#157A5A]">
                                Realizado con éxito
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-md bg-[#D92D20] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <span className="text-[12.5px] font-extrabold text-[#D92D20]">
                                Fallo de envío
                              </span>
                            </>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11.5px] text-[#5B5266] flex flex-col gap-0.5">
                          <span className="text-[10.5px] text-[#8A8095]">Fecha / Hora de envío:</span>
                          <span className="font-bold text-[#17131F]">
                            {hasCrm ? formatDateTime(sendDate) : "Almacenado en DB"}
                          </span>
                        </div>

                        {/* If Error: Dynamic Comment Box */}
                        {isFailed && (
                          <div className="mt-1 p-2.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-[11.5px] text-[#B42318] flex flex-col gap-1">
                            <span className="font-bold">Comentario de la API:</span>
                            <span className="font-mono text-[11px] leading-tight">
                              {crmLog?.responseMessage || "Error 500: Fallo de conexión con el servidor externo."}
                            </span>
                          </div>
                        )}

                        {isSuccess && hasCrm && (
                          <div className="text-[11px] text-[#5B5266] bg-white p-2 rounded-xl border border-[#F0EDF3] flex flex-col gap-0.5 truncate">
                            <span><strong>HTTP {crmLog?.responseCode || 200}:</strong> Entregado</span>
                          </div>
                        )}

                        {!hasCrm && (
                          <div className="text-[11px] text-[#8A8095] bg-white p-2 rounded-xl border border-[#F0EDF3]">
                            <span>Persistido en el sistema principal</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Attribution Matrix Card */}
              <div className="p-5 bg-[#FAF5FC] rounded-2xl border border-[#DDCBE6] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-extrabold text-[#5B2C72] m-0 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5B2C72]" />
                    <span>Trazabilidad de Atribución y Click IDs</span>
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getChannelBadge(selectedLead.attribution?.channel)}`}>
                    {selectedLead.attribution?.channel || "Directo"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] font-mono">
                  <div className="p-3 bg-white rounded-xl border border-[#E7E3EC] flex justify-between items-center">
                    <div>
                      <span className="text-[#8A8095] block text-[10.5px]">Google Click ID (GCLID)</span>
                      <span className="text-[#17131F] font-bold truncate max-w-[220px] block">
                        {selectedLead.attribution?.gclid || "No registrado"}
                      </span>
                    </div>
                    {selectedLead.attribution?.gclid && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedLead.attribution?.gclid || "", "gclid")}
                        className="text-[#5B2C72] text-[11px] font-bold cursor-pointer"
                      >
                        {copiedField === "gclid" ? "Copiado" : "Copiar"}
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E7E3EC] flex justify-between items-center">
                    <div>
                      <span className="text-[#8A8095] block text-[10.5px]">Meta Click ID (FBCLID)</span>
                      <span className="text-[#17131F] font-bold truncate max-w-[220px] block">
                        {selectedLead.attribution?.fbclid || "No registrado"}
                      </span>
                    </div>
                    {selectedLead.attribution?.fbclid && (
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedLead.attribution?.fbclid || "", "fbclid")}
                        className="text-[#5B2C72] text-[11px] font-bold cursor-pointer"
                      >
                        {copiedField === "fbclid" ? "Copiado" : "Copiar"}
                      </button>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E7E3EC] flex justify-between items-center">
                    <div>
                      <span className="text-[#8A8095] block text-[10.5px]">Meta FBC Cookie</span>
                      <span className="text-[#17131F] truncate max-w-[220px] block">
                        {selectedLead.attribution?.fbc || "fb.1.auto_generated"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E7E3EC] flex justify-between items-center">
                    <div>
                      <span className="text-[#8A8095] block text-[10.5px]">Meta FBP Cookie</span>
                      <span className="text-[#17131F] truncate max-w-[220px] block">
                        {selectedLead.attribution?.fbp || "fb.1.browser_id"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Campaign UTMs */}
                <div className="p-3 bg-white rounded-xl border border-[#E7E3EC] text-[12px] flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>utm_source:</strong> {selectedLead.attribution?.utm_source || "N/A"}</span>
                  <span><strong>utm_medium:</strong> {selectedLead.attribution?.utm_medium || "N/A"}</span>
                  <span><strong>utm_campaign:</strong> {selectedLead.attribution?.utm_campaign || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
