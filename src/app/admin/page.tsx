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
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { HeatmapStudio } from "@/components/admin/HeatmapStudio";
import { WhatsAppSettingsStudio } from "@/components/admin/WhatsAppSettingsStudio";
import { TrackingTagsStudio } from "@/components/admin/TrackingTagsStudio";
import { AudiencesStudio } from "@/components/admin/AudiencesStudio";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("summary");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [submissions, setSubmissions] = useState<FormSubmissionLog[]>([]);
  const [actions, setActions] = useState<UserActionLog[]>([]);
  const router = useRouter();

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
    refreshLogs();
    const interval = setInterval(refreshLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    try {
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
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E7E3EC] sticky top-0 z-30 shadow-2xs">
          <div className="px-6 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-[16px] text-[#17131F]">
                Bravo México · Portal de Administración
              </span>
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] text-[11.5px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#157A5A]" />
                <span>Sistema Operativo · En Línea</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="block text-[13px] font-bold text-[#17131F]">admin@bravo.mx</span>
                <span className="block text-[11px] text-[#8A8095]">Super Administrador</span>
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
        <main className="p-6 sm:p-8 flex-grow max-w-[1400px] w-full mx-auto">
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
          {activeTab === "forms" && <FormStudio />}

          {/* TAB 4: WhatsApp & Contact Channels Studio */}
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
