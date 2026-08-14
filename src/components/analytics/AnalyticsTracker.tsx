"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedMilestones = useRef<Set<number>>(new Set());

  // 1. Automatic Page View Tracking on Route & Param Change
  useEffect(() => {
    trackedMilestones.current.clear();

    const fullUrl = window.location.href;
    const pageTitle = document.title || "Bravo México";

    trackEvent("page_view", {
      page_path: pathname,
      page_title: pageTitle,
      page_location: fullUrl,
    });
  }, [pathname, searchParams]);

  // 2. Automatic Scroll Depth Milestones Tracking (25%, 50%, 75%, 90%, 100%)
  useEffect(() => {
    const milestones = [25, 50, 75, 90, 100];

    const handleScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentPercent = Math.round((window.scrollY / scrollHeight) * 100);

      milestones.forEach((threshold) => {
        if (currentPercent >= threshold && !trackedMilestones.current.has(threshold)) {
          trackedMilestones.current.add(threshold);
          trackEvent("scroll_depth", {
            percent_scrolled: threshold,
            page_path: pathname,
            page_title: document.title,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScrollDepth, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollDepth);
  }, [pathname]);

  // 3. Global Click Delegation for Outbound, Apps, Social & CTAs
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a, button");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const ariaLabel = target.getAttribute("aria-label") || "";
      const textContent = target.textContent?.trim() || ariaLabel;

      // App Store Outbound
      if (href.includes("apple.com") || href.includes("apps.apple.com")) {
        trackEvent("outbound_click", {
          url: href,
          outbound_type: "app_store",
          network: "Apple App Store",
        });
      }

      // Google Play Outbound
      else if (href.includes("play.google.com")) {
        trackEvent("outbound_click", {
          url: href,
          outbound_type: "google_play",
          network: "Google Play Store",
        });
      }

      // Social Media Outbound
      else if (href.includes("facebook.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "Facebook" });
      } else if (href.includes("instagram.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "Instagram" });
      } else if (href.includes("linkedin.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "LinkedIn" });
      } else if (href.includes("youtube.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "YouTube" });
      } else if (href.includes("tiktok.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "TikTok" });
      } else if (href.includes("twitter.com") || href.includes("x.com")) {
        trackEvent("outbound_click", { url: href, outbound_type: "social", network: "X (Twitter)" });
      }

      // General CTA buttons with data attribute or primary button classes
      const ctaId = target.getAttribute("data-cta-id") || target.getAttribute("id");
      if (ctaId) {
        trackEvent("cta_click", {
          cta_id: ctaId,
          placement: target.getAttribute("data-placement") || "page",
          cta_text: textContent,
          destination: href,
        });
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  // 4. Exact DOM Element Bounding Box Reporter for Heatmap Studio
  useEffect(() => {
    const reportBounds = () => {
      if (typeof window === "undefined") return;

      const selectors = [
        { id: "hero-primary-cta", selector: "#hero-primary-cta, a[href='#precalificar'], a[href='/formulario']" },
        { id: "hero-secondary-cta", selector: "#hero-secondary-cta, a[href='/como-funciona']" },
        { id: "calculator-cta", selector: "#simulador-de-liquidacion, input[type='range'], #precalificar" },
        { id: "savings-slider", selector: "section input[type='range']" },
        { id: "advisor-cta", selector: "a[href*='asesor'], a[href='/contacto']" },
        { id: "faq-cta", selector: "details, #faq" },
        { id: "final-cta-btn", selector: "section:last-of-type a" },
      ];

      const bounds: Array<{ id: string; top: number; leftPct: number; width: number; height: number }> = [];
      const docWidth = document.documentElement.clientWidth || window.innerWidth;

      selectors.forEach(({ id, selector }) => {
        const el = document.querySelector(selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const leftPct = Number(((centerX / docWidth) * 100).toFixed(1));

          bounds.push({
            id,
            top: Math.round(rect.top + window.scrollY),
            leftPct: Math.max(5, Math.min(95, leftPct)),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      });

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "BRAVO_ELEMENTS_BOUNDS",
            bounds,
            docHeight: document.documentElement.scrollHeight,
          },
          "*"
        );
      }
    };

    const timer = setTimeout(reportBounds, 300);
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "BRAVO_REQ_ELEMENTS_BOUNDS") {
        reportBounds();
      }
    };

    window.addEventListener("message", handleMsg);
    window.addEventListener("resize", reportBounds);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handleMsg);
      window.removeEventListener("resize", reportBounds);
    };
  }, [pathname]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
