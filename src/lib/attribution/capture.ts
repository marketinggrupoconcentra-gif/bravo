"use client";

import { useEffect } from "react";

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_id?: string;
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
  landing_page?: string;
  referrer?: string;
  device?: string;
  user_agent?: string;
  timestamp: string;
}

const FIRST_TOUCH_KEY = "bravo_attribution_first_touch";
const LAST_TOUCH_KEY = "bravo_attribution_last_touch";

// Helper: read a cookie value by name
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : undefined;
}

// Helper: set a first-party cookie with 90-day expiry
function setCookie(name: string, value: string, days = 90) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Capture and persist all marketing attribution variables from URL parameters,
 * first-party cookies, and browser environment.
 */
export function captureAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return { timestamp: new Date().toISOString() };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const now = Date.now();

  // 1. Meta (Facebook / Instagram) Cookies & Click IDs
  let fbclid = searchParams.get("fbclid") || undefined;
  let fbc = getCookie("_fbc");
  let fbp = getCookie("_fbp");

  // If fbclid is present in URL and _fbc cookie is missing, construct standard _fbc: fb.1.{timestamp}.{fbclid}
  if (fbclid && !fbc) {
    fbc = `fb.1.${now}.${fbclid}`;
    setCookie("_fbc", fbc, 90);
  }

  // If _fbp cookie is missing, construct standard _fbp: fb.1.{timestamp}.{random}
  if (!fbp) {
    const randomInt = Math.floor(Math.random() * 1000000000);
    fbp = `fb.1.${now}.${randomInt}`;
    setCookie("_fbp", fbp, 90);
  }

  // 2. Google Ads & Analytics IDs
  const gclid = searchParams.get("gclid") || undefined;
  const gbraid = searchParams.get("gbraid") || undefined;
  const wbraid = searchParams.get("wbraid") || undefined;
  const gaCookie = getCookie("_ga");
  const ga_client_id = gaCookie ? gaCookie.replace(/^GA1\.\d\./, "") : undefined;

  // 3. TikTok Ads ID
  const ttclid = searchParams.get("ttclid") || undefined;

  // 4. UTM Parameters
  const utm_source = searchParams.get("utm_source") || undefined;
  const utm_medium = searchParams.get("utm_medium") || undefined;
  const utm_campaign = searchParams.get("utm_campaign") || undefined;
  const utm_id = searchParams.get("utm_id") || undefined;
  const utm_term = searchParams.get("utm_term") || undefined;
  const utm_content = searchParams.get("utm_content") || undefined;

  // 5. Technical Context
  const landing_page = window.location.pathname;
  const referrer = document.referrer || "Directo";
  const user_agent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
  const isMobile = user_agent ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(user_agent) : false;
  const device = isMobile ? "Móvil" : "Escritorio";

  const currentTouch: AttributionData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_id,
    utm_term,
    utm_content,
    gclid,
    gbraid,
    wbraid,
    fbclid,
    ttclid,
    fbc,
    fbp,
    ga_client_id,
    landing_page,
    referrer,
    device,
    user_agent,
    timestamp: new Date().toISOString(),
  };

  // Only store if there are meaningful parameters or this is the first visit
  const hasMarketingParams = Boolean(
    utm_source || utm_campaign || gclid || fbclid || ttclid || gbraid || wbraid
  );

  try {
    // 1. First Touch (Never overwritten once set)
    const existingFirst = localStorage.getItem(FIRST_TOUCH_KEY);
    if (!existingFirst) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(currentTouch));
    }

    // 2. Last Touch (Always updated if marketing parameters exist or last touch is absent)
    if (hasMarketingParams || !localStorage.getItem(LAST_TOUCH_KEY)) {
      localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(currentTouch));
    }
  } catch {
    // safe fallback
  }

  return currentTouch;
}

/**
 * Hook to execute attribution capture automatically on component mount
 */
export function useAttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
}

/**
 * Retrieve consolidated attribution data (First Touch + Last Touch merged)
 * to attach to form submissions or API calls.
 */
export function getLeadAttributionPayload(): {
  first_touch?: AttributionData;
  last_touch?: AttributionData;
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  ga_client_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  channel: "Google Ads" | "Meta Ads" | "TikTok Ads" | "Orgánico" | "Directo" | "Referencia";
} {
  let firstTouch: AttributionData | undefined;
  let lastTouch: AttributionData | undefined;

  if (typeof window !== "undefined") {
    try {
      const rawFirst = localStorage.getItem(FIRST_TOUCH_KEY);
      if (rawFirst) firstTouch = JSON.parse(rawFirst);

      const rawLast = localStorage.getItem(LAST_TOUCH_KEY);
      if (rawLast) lastTouch = JSON.parse(rawLast);
    } catch {
      // ignore
    }
  }

  // Fallback to active live capture if storage is empty
  const active = lastTouch || firstTouch || captureAttribution();

  // Determine High-Level Attribution Channel
  let channel: "Google Ads" | "Meta Ads" | "TikTok Ads" | "Orgánico" | "Directo" | "Referencia" = "Directo";

  if (active.gclid || active.gbraid || active.wbraid || active.utm_source?.toLowerCase().includes("google")) {
    channel = "Google Ads";
  } else if (active.fbclid || active.fbc || active.utm_source?.toLowerCase().includes("facebook") || active.utm_source?.toLowerCase().includes("meta") || active.utm_source?.toLowerCase().includes("instagram")) {
    channel = "Meta Ads";
  } else if (active.ttclid || active.utm_source?.toLowerCase().includes("tiktok")) {
    channel = "TikTok Ads";
  } else if (active.referrer && (active.referrer.includes("google.") || active.referrer.includes("bing.") || active.referrer.includes("duckduckgo."))) {
    channel = "Orgánico";
  } else if (active.referrer && active.referrer !== "Directo" && !active.referrer.includes(typeof window !== "undefined" ? window.location.hostname : "")) {
    channel = "Referencia";
  }

  return {
    first_touch: firstTouch,
    last_touch: lastTouch,
    gclid: active.gclid,
    fbclid: active.fbclid,
    fbc: active.fbc,
    fbp: active.fbp,
    ga_client_id: active.ga_client_id,
    utm_source: active.utm_source,
    utm_medium: active.utm_medium,
    utm_campaign: active.utm_campaign,
    utm_term: active.utm_term,
    utm_content: active.utm_content,
    channel,
  };
}
