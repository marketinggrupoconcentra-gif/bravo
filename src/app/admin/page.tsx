"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchFormSubmissions,
  fetchUserActions,
  updateSubmissionStatus,
  FormSubmissionLog,
  UserActionLog,
} from "@/lib/telemetry/logger";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { LandingEditor } from "@/components/admin/LandingEditor";
import { FormStudio } from "@/components/admin/FormStudio";
import { LandingsStudio } from "@/components/admin/LandingsStudio";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { HeatmapStudio } from "@/components/admin/HeatmapStudio";
import { WhatsAppSettingsStudio } from "@/components/admin/WhatsAppSettingsStudio";
import { TrackingTagsStudio } from "@/components/admin/TrackingTagsStudio";
import { AudiencesStudio } from "@/components/admin/AudiencesStudio";
import { ClaimsStudio } from "@/components/admin/ClaimsStudio";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("summary");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmissionLog[]>([]);
  const [actions, setActions] = useState<UserActionLog[]>([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  // ─── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const isAuthed = sessionStorage.getItem("bravo_admin_auth") === "true";
      if (!isAuthed) {
        router.replace("/acceso");
        return;
      }
    } catch {
      router.replace("/acceso");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthChecked(true);
  }, [router]);

  // Load real logs from database
  const refreshLogs = async () => {
    try {
      const dbSubmissions = await fetchFormSubmissions();
      setSubmissions(dbSubmissions || []);

      const dbActions = await fetchUserActions();
      setActions(dbActions || []);
    } catch (err) {
      console.error("Error refreshing logs:", err);
    }
  };

  useEffect(() => {
    if (!isAuthChecked) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshLogs();
    const interval = setInterval(refreshLogs, 4000);
    return () => clearInterval(interval);
  }, [isAuthChecked]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      sessionStorage.removeItem("bravo_admin_auth");
      sessionStorage.removeItem("bravo_admin_user");
    } catch {
      // ignore
    }
    router.push("/acceso");
  };

  const handleStatusChange = (id: string, newStatus: FormSubmissionLog["status"]) => {
    updateSubmissionStatus(id, newStatus);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  // Don't render anything until auth is confirmed — prevents flash of dashboard
  if (!isAuthChecked) return null;

  return (
    <div className="min-h-screen bg-[#F5F3F7] text-[#17131F] flex font-sans">
      {/* 1. Collapsible Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        leadsCount={submissions.length}
        eventsCount={actions.length}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E7E3EC] sticky top-0 z-30 shadow-2xs">
          <div className="px-6 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F5EDF9] text-[#5B2C72] hover:bg-[#EDD9FA] transition-colors cursor-pointer mr-1"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="font-extrabold text-[14px] sm:text-[16px] text-[#17131F] truncate">
                Bravo · Admin
              </span>
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] text-[11.5px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#157A5A]" />
                <span>Sistema Operativo · En Línea</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-left">
                <span className="block text-[13px] font-bold text-[#17131F]">Administrador del Sistema</span>
                <span className="block text-[11px] text-[#5B5266]">Bravo Operaciones</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-[#FAF8FB] hover:bg-[#F5EDF9] border border-[#C9C1D4] text-[#5B2C72] text-[12.5px] font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="p-3 sm:p-6 lg:p-8 flex-grow max-w-[1400px] w-full mx-auto">
          {/* TAB 0: Executive Summary & Performance Metrics */}
          {activeTab === "summary" && (
            <ExecutiveSummary
              submissions={submissions}
              actions={actions}
              onRefresh={refreshLogs}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 1: Records & Dossier Manager */}
          {activeTab === "records" && (
            <RecordsManager
              submissions={submissions}
              onStatusChange={handleStatusChange}
              onRefresh={refreshLogs}
            />
          )}

          {/* TAB 2: Landing Page CMS Editor */}
          {activeTab === "cms_editor" && <LandingEditor />}

          {/* TAB 3: Form Studio & Webhook Integrations */}
          {activeTab === "form" && <FormStudio />}
          {activeTab === "landings" && <LandingsStudio />}
          {activeTab === "claims" && <ClaimsStudio />}
          {activeTab === "whatsapp" && <WhatsAppSettingsStudio />}

          {/* TAB 5: Tracking Tags & Pixels Studio */}
          {activeTab === "tracking_tags" && <TrackingTagsStudio />}

          {/* TAB 6: Audiences & Attribution Return Studio (Meta CAPI, Google Offline, CRM) */}
          {activeTab === "audiences" && (
            <AudiencesStudio
              submissions={submissions}
              onRefresh={refreshLogs}
            />
          )}

          {/* TAB 7: Heatmaps Studio (Live Visual Heatmaps per Page) */}
          {activeTab === "heatmaps" && <HeatmapStudio actions={actions} />}

          {/* TAB 8: Telemetry & Visual Analytics Dashboard */}
          {activeTab === "telemetry" && (
            <AnalyticsDashboard
              actions={actions}
              submissions={submissions}
              onRefresh={refreshLogs}
            />
          )}
        </main>
      </div>
    </div>
  );
}
