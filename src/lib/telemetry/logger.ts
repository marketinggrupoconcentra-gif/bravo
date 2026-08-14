import { getLeadAttributionPayload, AttributionData } from "@/lib/attribution/capture";

export interface ApiPlatformSyncStatus {
  status: "success" | "failed" | "pending" | "none";
  sentAt?: string;
  responseCode?: number;
  responseMessage?: string;
  details?: Record<string, unknown>;
}

export interface ApiSyncLogs {
  meta_capi?: ApiPlatformSyncStatus;
  google_ads?: ApiPlatformSyncStatus;
  crm_webhook?: ApiPlatformSyncStatus;
}

export interface FormSubmissionLog {
  id: string;
  folio: string;
  nombre: string;
  institucion: string;
  tipoDeuda: string;
  monto: string;
  celular: string;
  email: string;
  submittedAt: string;
  status: "Nuevo" | "En Análisis" | "Contactado" | "Convenio Aceptado" | "Archivado";
  device?: string;
  referrer?: string;
  notes?: string;
  api_sync_logs?: ApiSyncLogs;
  attribution?: {
    channel?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    fbclid?: string;
    ttclid?: string;
    fbc?: string;
    fbp?: string;
    ga_client_id?: string;
    first_touch?: AttributionData;
    last_touch?: AttributionData;
  };
}

export interface UserActionLog {
  id: string;
  event: string;
  page_path: string;
  page_title?: string;
  details: Record<string, unknown>;
  timestamp: string;
  device?: string;
}

const SUBMISSIONS_KEY = "bravo_lead_submissions_log";
const ACTIONS_KEY = "bravo_user_actions_log";

// 1. Log a Form Submission (Saves to Neon DB via API + Local Storage + Optional Webhook)
export function logFormSubmission(
  submission: Omit<FormSubmissionLog, "id" | "submittedAt" | "status">,
  customWebhookConfig?: Record<string, any>
): FormSubmissionLog {
  const deviceType =
    typeof navigator !== "undefined" && navigator.userAgent.includes("Mobile")
      ? "Móvil"
      : "Escritorio";
  const ref = typeof document !== "undefined" ? document.referrer || "Directo" : "Directo";

  // Capture attribution payload if not already provided
  const capturedAttribution = submission.attribution || getLeadAttributionPayload();

  const record: FormSubmissionLog = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    submittedAt: new Date().toISOString(),
    status: "Nuevo",
    device: deviceType,
    referrer: ref,
    attribution: capturedAttribution,
  };

  // Local storage cache
  if (typeof window !== "undefined") {
    try {
      const existing = getLocalSubmissions();
      const updated = [record, ...existing].slice(0, 200);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist to Neon Postgres DB via API
    // webhookConfig is intentionally NOT sent — server decides integration destinations.
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folio: record.folio,
        nombre: record.nombre,
        institucion: record.institucion,
        tipoDeuda: record.tipoDeuda,
        monto: record.monto,
        celular: record.celular,
        email: record.email,
        device: record.device,
        referrer: record.referrer,
        attribution: record.attribution,
      }),
    }).catch((err) => console.warn("[Neon Sync] Form submission fallback to local:", err));
  }

  return record;
}

// 2. Helper to get local submissions
export function getLocalSubmissions(): FormSubmissionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// 3. Fetch All Form Submissions (from Neon Postgres with local fallback)
export async function fetchFormSubmissions(): Promise<FormSubmissionLog[]> {
  if (typeof window === "undefined") return [];

  try {
    const res = await fetch("/api/leads?limit=150");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
        return data.leads;
      }
    }
  } catch (err) {
    console.warn("[Neon Fetch Error] using local storage fallback", err);
  }

  return getLocalSubmissions();
}

// 4. Update Submission Status in Neon Postgres
export async function updateSubmissionStatus(
  id: string,
  newStatus: FormSubmissionLog["status"]
): Promise<void> {
  if (typeof window === "undefined") return;

  // Update local
  try {
    const items = getLocalSubmissions();
    const updated = items.map((item) => (item.id === id || item.folio === id ? { ...item, status: newStatus } : item));
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Update in Neon Postgres
  try {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (err) {
    console.error("[Neon Update Error]", err);
  }
}

// 5. Log User Action / Analytics Event (Saves to Neon DB via API + Local Storage)
export function logUserAction(event: string, details: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const deviceType = navigator.userAgent.includes("Mobile") ? "Móvil" : "Escritorio";
  const actionRecord: UserActionLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event,
    page_path: window.location.pathname,
    page_title: document.title || "Bravo México",
    details,
    timestamp: new Date().toISOString(),
    device: deviceType,
  };

  // Local storage cache
  try {
    const raw = localStorage.getItem(ACTIONS_KEY);
    const existing: UserActionLog[] = raw ? JSON.parse(raw) : [];
    const updated = [actionRecord, ...existing].slice(0, 300);
    localStorage.setItem(ACTIONS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Real-time broadcast for heatmap and telemetry studio
  try {
    window.dispatchEvent(new CustomEvent("BRAVO_ACTION_LOGGED", { detail: actionRecord }));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "BRAVO_HEATMAP_ACTION", payload: actionRecord }, "*");
    }
  } catch {
    // ignore
  }

  // Persist to Neon Postgres DB via API
  fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actionRecord),
  }).catch(() => {});
}

// 6. Helper to get local actions
export function getLocalUserActions(): UserActionLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// 7. Fetch All User Actions (from Neon Postgres with local fallback)
export async function fetchUserActions(): Promise<UserActionLog[]> {
  if (typeof window === "undefined") return [];

  try {
    const res = await fetch("/api/telemetry?limit=200");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.events) && data.events.length > 0) {
        return data.events;
      }
    }
  } catch {
    // ignore
  }

  return getLocalUserActions();
}

// 8. Clear Local Logs
export function clearLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SUBMISSIONS_KEY);
  localStorage.removeItem(ACTIONS_KEY);
}
