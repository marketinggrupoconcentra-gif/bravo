"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_CMS_SECTIONS, CmsSectionConfig } from "@/config/cmsDefault";

interface CmsContextType {
  sections: Record<string, CmsSectionConfig>;
  getSection: (id: string) => CmsSectionConfig;
  updateSection: (id: string, updates: Partial<CmsSectionConfig>) => Promise<boolean>;
  resetSection: (id: string) => void;
  isLoading: boolean;
  setDraftSection: (id: string, draft: Partial<CmsSectionConfig>) => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Record<string, CmsSectionConfig>>(DEFAULT_CMS_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Hydrate from Storage API + localStorage
  useEffect(() => {
    async function loadCmsContent() {
      try {
        // Try local storage cache first
        const localCached = localStorage.getItem("bravo_cms_sections_cache");
        if (localCached) {
          const parsed = JSON.parse(localCached);
          setSections((prev) => ({ ...prev, ...parsed }));
        }

        // Fetch from Neon Postgres
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items) && data.items.length > 0) {
            const dbMap: Record<string, CmsSectionConfig> = {};
            data.items.forEach((item: any) => {
              dbMap[item.id] = {
                id: item.id,
                pageSlug: item.pageSlug,
                pageName: DEFAULT_CMS_SECTIONS[item.id]?.pageName || item.pageSlug,
                sectionId: item.sectionId,
                sectionName: DEFAULT_CMS_SECTIONS[item.id]?.sectionName || item.sectionId,
                title: item.title,
                subtitle: item.subtitle,
                badge: item.badge,
                description: item.description,
                primaryCtaText: item.primaryCtaText,
                primaryCtaUrl: item.primaryCtaUrl,
                secondaryCtaText: item.secondaryCtaText,
                secondaryCtaUrl: item.secondaryCtaUrl,
                backgroundStyle: item.backgroundStyle || "default",
                themeMode: item.themeMode || "light",
              };
            });

            setSections((prev) => {
              const merged = { ...prev, ...dbMap };
              localStorage.setItem("bravo_cms_sections_cache", JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn("[CMS Hydration] using default/cached config:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCmsContent();
  }, []);

  // 2. Listen for Real-Time Live Preview messages from the Admin Editor
  useEffect(() => {
    const clearActiveHighlight = () => {
      document.querySelectorAll(".bravo-inspector-active").forEach((el) => {
        el.classList.remove(
          "bravo-inspector-active",
          "ring-4",
          "ring-[#5ECBDB]",
          "outline-3",
          "outline-dashed",
          "outline-[#5ECBDB]",
          "shadow-[0_0_30px_rgba(94,203,219,0.8)]"
        );
      });
      const badge = document.getElementById("bravo-inspector-tag");
      if (badge) badge.remove();
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      // Security: only accept messages from the same origin (admin preview)
      // event.source must be our own admin window or an embedded iframe from same origin.
      const allowedOrigin = window.location.origin;
      if (event.origin !== allowedOrigin) {
        // Silently ignore cross-origin postMessages
        return;
      }

      // Real-time live draft update
      if (event.data.type === "BRAVO_CMS_PREVIEW_SYNC") {
        const { sectionId, data } = event.data;
        if (sectionId && data) {
          setSections((prev) => ({
            ...prev,
            [sectionId]: {
              ...(prev[sectionId] || DEFAULT_CMS_SECTIONS[sectionId] || {}),
              ...data,
            },
          }));
        }
      }

      // Smooth scroll to section in preview iframe
      if (event.data.type === "BRAVO_CMS_SCROLL_TO") {
        const targetId = event.data.targetId;
        if (targetId) {
          const el = document.getElementById(targetId) || document.querySelector(`[data-cms-section="${targetId}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            clearActiveHighlight();
            el.classList.add(
              "bravo-inspector-active",
              "ring-4",
              "ring-[#5ECBDB]",
              "transition-all",
              "duration-500"
            );
            setTimeout(() => {
              el.classList.remove("ring-4", "ring-[#5ECBDB]");
            }, 2500);
          }
        }
      }

      // Precise Element-Level Inspector Highlighting
      if (event.data.type === "BRAVO_CMS_HIGHLIGHT_ELEMENT") {
        const { sectionId, fieldKey, fieldLabel } = event.data;
        clearActiveHighlight();

        if (!fieldKey && !sectionId) return;

        let targetEl: Element | null = null;

        if (fieldKey && sectionId) {
          targetEl = document.querySelector(
            `[data-cms-section="${sectionId}"] [data-cms-field="${fieldKey}"]`
          );
        }

        if (!targetEl && fieldKey) {
          targetEl = document.querySelector(`[data-cms-field="${fieldKey}"]`);
        }

        if (!targetEl && sectionId) {
          targetEl =
            document.querySelector(`[data-cms-section="${sectionId}"]`) ||
            document.getElementById(sectionId);
        }

        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          const isVisible = rect.top >= 80 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 80;
          if (!isVisible) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
          }
          targetEl.classList.add(
            "bravo-inspector-active",
            "ring-4",
            "ring-[#5ECBDB]",
            "outline-3",
            "outline-dashed",
            "outline-[#5ECBDB]",
            "shadow-[0_0_30px_rgba(94,203,219,0.8)]"
          );

          // Add floating inspector tag pill — use DOM APIs (no innerHTML with user data)
          const tag = document.createElement("div");
          tag.id = "bravo-inspector-tag";
          tag.className =
            "absolute -top-7 left-2 z-50 bg-[#1E0F26] text-[#5ECBDB] border border-[#5ECBDB] font-mono text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none transition-transform duration-200 ease-out";

          // Safe SVG node (static — no user input interpolated)
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("class", "w-3 h-3 inline-block");
          svg.setAttribute("fill", "none");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("stroke", "currentColor");
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          path.setAttribute("stroke-width", "2");
          path.setAttribute("d", "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z");
          svg.appendChild(path);

          // Safe text node — no interpolation of user-controlled values via innerHTML
          const labelSpan = document.createElement("span");
          const labelText = String(fieldLabel || fieldKey || "Elemento").slice(0, 60);
          labelSpan.textContent = `Editando: ${labelText}`;

          tag.appendChild(svg);
          tag.appendChild(labelSpan);
          
          if (getComputedStyle(targetEl).position === "static") {
            (targetEl as HTMLElement).style.position = "relative";
          }
          targetEl.appendChild(tag);
        }
      }

      // Clear highlight
      if (event.data.type === "BRAVO_CMS_CLEAR_HIGHLIGHT") {
        clearActiveHighlight();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearActiveHighlight();
    };
  }, []);

  const getSection = useCallback(
    (id: string): CmsSectionConfig => {
      return sections[id] || DEFAULT_CMS_SECTIONS[id] || {
        id,
        pageSlug: "home",
        pageName: "Página",
        sectionId: "section",
        sectionName: "Sección",
        title: "",
      };
    },
    [sections]
  );

  // Set transient draft in memory (instant feedback)
  const setDraftSection = useCallback((id: string, draft: Partial<CmsSectionConfig>) => {
    setSections((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || DEFAULT_CMS_SECTIONS[id] || {}),
        ...draft,
      },
    }));
  }, []);

  // Save permanently to storage & localStorage
  const updateSection = async (id: string, updates: Partial<CmsSectionConfig>): Promise<boolean> => {
    const current = getSection(id);
    const updated: CmsSectionConfig = { ...current, ...updates };

    // Update state & cache
    setSections((prev) => {
      const next = { ...prev, [id]: updated };
      localStorage.setItem("bravo_cms_sections_cache", JSON.stringify(next));
      return next;
    });

    // Save to storage
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug: updated.pageSlug,
          sectionId: updated.sectionId,
          title: updated.title,
          subtitle: updated.subtitle,
          badge: updated.badge,
          description: updated.description,
          primaryCtaText: updated.primaryCtaText,
          primaryCtaUrl: updated.primaryCtaUrl,
          secondaryCtaText: updated.secondaryCtaText,
          secondaryCtaUrl: updated.secondaryCtaUrl,
          backgroundStyle: updated.backgroundStyle,
          themeMode: updated.themeMode,
        }),
      });

      return res.ok;
    } catch (err) {
      console.error("[CMS Update Error]", err);
      return false;
    }
  };

  const resetSection = (id: string) => {
    if (DEFAULT_CMS_SECTIONS[id]) {
      updateSection(id, DEFAULT_CMS_SECTIONS[id]);
    }
  };

  return (
    <CmsContext.Provider
      value={{
        sections,
        getSection,
        updateSection,
        resetSection,
        isLoading,
        setDraftSection,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    return {
      sections: DEFAULT_CMS_SECTIONS,
      getSection: (id: string) => DEFAULT_CMS_SECTIONS[id] || { id, pageSlug: "home", pageName: "", sectionId: "", sectionName: "", title: "" },
      updateSection: async () => false,
      resetSection: () => {},
      isLoading: false,
      setDraftSection: () => {},
    };
  }
  return context;
}
