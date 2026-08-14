"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { DataProtectionIcon } from "@/components/icons/bravo";

export default function AccesoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo institucional y contraseña.");
      return;
    }

    setIsLoading(true);

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Fallback flag for UI components that check client-side state
        // The real auth is now in the HTTP-Only cookie handled by Middleware
        try {
          sessionStorage.setItem("bravo_admin_auth", "true");
          sessionStorage.setItem(
            "bravo_admin_user",
            JSON.stringify({
              name: "Administrador de Operaciones",
              email: email.trim().toLowerCase(),
              role: "Super Admin",
            })
          );
        } catch {
          // ignore
        }
        router.push("/admin");
      } else {
        setIsLoading(false);
        setError(data.error || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Error de conexión al servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EEF3] flex flex-col justify-between items-center py-10 px-4">
      {/* Top Bar with Return Link */}
      <div className="w-full max-w-[1100px] flex justify-between items-center pb-6">
        <BrandLogo />
        <Link
          href="/"
          className="text-[14px] font-bold text-[#5B2C72] hover:text-[#45205A] transition-colors bg-white px-4 py-2 rounded-full border border-[#E7E3EC] shadow-2xs"
        >
          ← Volver a la landing
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-7 sm:p-10 border border-[#E7E3EC] shadow-xl relative overflow-hidden flex flex-col gap-6">
        {/* Glow Element */}
        <div
          className="pointer-events-none absolute -top-[100px] -right-[100px] w-[260px] h-[260px] rounded-full opacity-20 blur-[60px]"
          style={{ background: "radial-gradient(circle, #5B2C72 0%, transparent 70%)" }}
        />

        {/* Header */}
        <div className="flex flex-col gap-2 relative z-10">
          <div className="inline-flex self-start items-center gap-1.5 bg-[#F5EDF9] border border-[#DDCBE6] text-[#5B2C72] text-[11.5px] font-mono font-bold px-3 py-1 rounded-full">
            <span>PANEL DE CONTROL & ANALÍTICA</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Acceso al Backend
          </h1>
          <p className="text-[14px] text-[#5B5266] m-0 leading-relaxed">
            Ingresa para consultar el registro en tiempo real de formularios recibidos, telemetría y actividad de usuarios.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#FFF5F5] border border-[#F5C2C7] text-[#842029] p-3.5 rounded-[12px] text-[13.5px] font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <svg className="w-5 h-5 text-[#B02A24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-[13.5px] font-bold text-[#17131F]">
              Usuario institucional
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@bravo.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 border border-[#C9C1D4] rounded-[12px] text-[15px] focus:border-[#5B2C72] focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,44,114,0.12)] transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="admin-password" className="text-[13.5px] font-bold text-[#17131F]">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[12.5px] text-[#5B2C72] hover:underline font-semibold cursor-pointer"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 border border-[#C9C1D4] rounded-[12px] text-[15px] focus:border-[#5B2C72] focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,44,114,0.12)] transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[13.5px] text-[#3A3344] select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#5B2C72] focus:ring-[#5B2C72] cursor-pointer"
              />
              <span>Recordar sesión</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-[#5B2C72] hover:bg-[#45205A] text-white font-extrabold text-[16px] rounded-full transition-all duration-200 shadow-md active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <span>Acceder al panel</span>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="text-[12px] text-[#8A8095] flex items-center justify-center gap-1.5 text-center pt-2 border-t border-[#F0EDF3]">
          <DataProtectionIcon size={14} className="text-[#157A5A] shrink-0" />
          <span>Acceso restringido a personal autorizado · Cifrado SSL 256 bits</span>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-[13px] text-[#8A8095] text-center pt-6">
        © {new Date().getFullYear()} Bravo México · Panel de Control y Analítica
      </div>
    </div>
  );
}
