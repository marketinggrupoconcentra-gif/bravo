"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollObserver() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Scroll Progress Bar Tracking
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Intersection Observer for Scroll Reveals
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.08,
      rootMargin: "0px 0px -50px 0px",
    });

    const observeAll = () => {
      const revealElements = document.querySelectorAll(
        ".reveal-init:not(.reveal-visible), .reveal-fade-left:not(.reveal-fade-visible), .reveal-fade-right:not(.reveal-visible), .reveal-scale:not(.reveal-visible)"
      );
      revealElements.forEach((el) => observer.observe(el));
    };

    // Initial check after paint
    const timer = setTimeout(observeAll, 60);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
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
