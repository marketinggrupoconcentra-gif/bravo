"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollObserver() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Scroll Progress Bar
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Intersection Observer for Scroll Reveals
    const observerCallback: IntersectionObserverCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    };

    // ── FIX 3: rootMargin adapts to viewport height ──
    const isMobile = window.innerHeight < 700;
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.06,
      rootMargin: isMobile ? "0px 0px -20px 0px" : "0px 0px -50px 0px",
    });

    // ── FIX 1: unified selector — all classes trigger .reveal-visible ──
    const SELECTOR = [
      ".reveal-init:not(.reveal-visible)",
      ".reveal-fade-left:not(.reveal-visible)",   // was wrongly :not(.reveal-fade-visible)
      ".reveal-fade-right:not(.reveal-visible)",
      ".reveal-scale:not(.reveal-visible)",
    ].join(", ");

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
    };

    // Initial scan after paint
    const timer = setTimeout(observeAll, 80);

    // ── FIX 2: MutationObserver picks up dynamically rendered elements ──
    const mutObs = new MutationObserver(() => {
      // Only re-scan nodes not yet visible
      document.querySelectorAll(SELECTOR).forEach((el) => {
        try { observer.observe(el); } catch { /* already observed */ }
      });
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      mutObs.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {/* Top Global Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3.5px] z-[100] pointer-events-none bg-black/5 backdrop-blur-xs"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#5B2C72] via-[#5ECBDB] to-[#AB6CCA] transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </>
  );
}
