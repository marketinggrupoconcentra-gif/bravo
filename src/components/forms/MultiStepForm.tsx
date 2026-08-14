"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  prequalificationForm,
  allDebtInstitutions,
  getInstitutionsByDebtType,
  getDropdownPlaceholder,
} from "@/config/forms";
import { trackEvent } from "@/lib/analytics/track";
import { checkRateLimit, clearRateLimit } from "@/lib/utils/rateLimiter";
import {
  CreditCardIcon,
  PersonalLoanIcon,
  RetailDebtIcon,
  CarDebtIcon,
  OtherDebtIcon,
  CheckIcon,
} from "@/components/icons/bravo";

const debtIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  tarjeta_credito: CreditCardIcon,
  prestamo_personal: PersonalLoanIcon,
  tarjeta_departamental: RetailDebtIcon,
  credito_automotriz: CarDebtIcon,
  otro: OtherDebtIcon,
};

import {
  FormStudioConfig,
  DEFAULT_FORM_STUDIO_CONFIG,
} from "@/config/formPresets";

export function MultiStepForm() {
  const [studioConfig, setStudioConfig] = useState<FormStudioConfig>(DEFAULT_FORM_STUDIO_CONFIG);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  // Load custom Form Studio Config if defined
  useEffect(() => {
    try {
      const cached = localStorage.getItem("bravo_form_studio_config");
      if (cached) setStudioConfig(JSON.parse(cached));
    } catch {}

    const handleUpdate = (e: any) => {
      if (e.detail) setStudioConfig(e.detail);
    };
    window.addEventListener("BRAVO_FORM_STUDIO_UPDATED", handleUpdate);
    return () => window.removeEventListener("BRAVO_FORM_STUDIO_UPDATED", handleUpdate);
  }, []);

  const updateData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // Dynamic institution groups based on currently selected debt type
  const currentInstitutionGroups = useMemo(() => {
    return getInstitutionsByDebtType(formData.tipoDeuda);
  }, [formData.tipoDeuda]);

  const dropdownPlaceholder = useMemo(() => {
    return getDropdownPlaceholder(formData.tipoDeuda);
  }, [formData.tipoDeuda]);

  // When changing debt type, verify if selected institution is still valid or reset
  const handleDebtTypeChange = (newType: string) => {
    updateData("tipoDeuda", newType);
    const validInstitutions = getInstitutionsByDebtType(newType).flatMap((g) =>
      g.options.map((o) => o.value)
    );
    if (formData.institucion && !validInstitutions.includes(formData.institucion)) {
      updateData("institucion", "");
    }
  };

  // --- Strict Validation Rules (Candados) ---
  const isNameValid = useMemo(() => {
    if (!formData.nombre) return false;
    const trimmed = formData.nombre.trim();
    return trimmed.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(trimmed);
  }, [formData.nombre]);

  const isPhoneValid = useMemo(() => {
    if (!formData.celular) return false;
    const clean = formData.celular.replace(/\D/g, "");
    if (clean.length !== 10) return false;
    if (/^(\d)\1{9}$/.test(clean)) return false;
    return true;
  }, [formData.celular]);

  const isEmailValid = useMemo(() => {
    if (!formData.email) return false;
    const trimmed = formData.email.trim();
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
  }, [formData.email]);

  const isInstitutionValid = useMemo(() => {
    if (!formData.institucion) return false;
    if (formData.institucion === "otra_institucion") {
      return Boolean(formData.otraInstitucionNombre && formData.otraInstitucionNombre.trim().length >= 2);
    }
    return true;
  }, [formData.institucion, formData.otraInstitucionNombre]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(formData.amount);
      case 1:
        return Boolean(formData.tipoDeuda && isInstitutionValid);
      case 2:
        return isNameValid && isPhoneValid && isEmailValid;
      case 3:
        return privacyAccepted;
      default:
        return false;
    }
  }, [step, formData, isInstitutionValid, isNameValid, isPhoneValid, isEmailValid, privacyAccepted]);

  // Track form view on mount
  React.useEffect(() => {
    trackEvent("form_view", { form_id: "prequal", step_number: 1 });
  }, []);

  const handleNext = () => {
    if (!isStepValid) return;
    trackEvent("form_step_complete", { step_number: step + 1, form_id: "prequal" });
    setStep((s) => s + 1);
    trackEvent("form_step_view", { step_number: step + 2, form_id: "prequal" });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    trackEvent("form_submit_attempt", { form_id: "prequal" });

    // Build lead data
    const leadName = formData.nombre?.trim() || "Titular";
    const phoneDigits = formData.celular?.replace(/\D/g, "") || "";
    const last4 = phoneDigits.slice(-4) || "0000";
    const instName = getInstitutionDisplay(formData.institucion, formData.otraInstitucionNombre);
    const debtName = getDebtTypeDisplay(formData.tipoDeuda);
    const amtName = getAmountDisplay(formData.amount);
    const folioCode = `BR-${Math.floor(100000 + Math.random() * 900000)}`;
    const deviceType =
      typeof navigator !== "undefined" && navigator.userAgent.includes("Mobile")
        ? "M\u00f3vil"
        : "Escritorio";
    const referrerVal =
      typeof document !== "undefined" ? document.referrer || "Directo" : "Directo";

    const leadSummary = {
      nombre: leadName,
      amount: amtName,
      tipoDeuda: debtName,
      institucion: instName,
      celular: formData.celular || "",
      last4,
      email: formData.email || "",
      folio: folioCode,
      submittedAt: new Date().toISOString(),
    };

    // Persist to sessionStorage for /gracias page
    try {
      sessionStorage.setItem("bravo_lead_summary", JSON.stringify(leadSummary));
    } catch {
      // safe fallback
    }

    // ── Rate limit check: 1 submit per 60s ────────────────────────────
    const rateCheck = checkRateLimit("form_submit", 60_000, 1);
    if (!rateCheck.allowed) {
      setSubmitError(
        `Por seguridad, espera ${rateCheck.secondsRemaining} segundo${rateCheck.secondsRemaining !== 1 ? "s" : ""} antes de intentar nuevamente.`
      );
      setIsSubmitting(false);
      return;
    }

    // ── Real API call to Neon backend ────────────────────────────
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio: folioCode,
          nombre: leadName,
          institucion: instName,
          tipoDeuda: debtName,
          monto: amtName,
          celular: formData.celular || "",
          email: formData.email || "",
          device: deviceType,
          referrer: referrerVal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || `Error del servidor (HTTP ${res.status}). Int\u00e9ntalo nuevamente.`
        );
      }

      // Success — update folio from backend if provided
      if (data.lead?.folio) {
        leadSummary.folio = data.lead.folio;
        try {
          sessionStorage.setItem("bravo_lead_summary", JSON.stringify(leadSummary));
        } catch {}
      }

      trackEvent("prequalification_complete", { form_id: "prequal", folio: leadSummary.folio });
      trackEvent("generate_lead", {
        form_id: "prequal",
        debt_range: formData.amount,
        entity_type: formData.tipoDeuda,
      });

      // Clear rate limit after successful submission (allow fresh submit on /gracias revisit)
      clearRateLimit("form_submit");

      // Redirect to /gracias
      const redirectUrl = data.redirectUrl || "/gracias";
      router.push(redirectUrl);
    } catch (err: any) {
      console.error("[Form] Submit error:", err);
      setSubmitError(
        err?.message ||
          "Ocurri\u00f3 un error al enviar tu solicitud. Verifica tu conexi\u00f3n e int\u00e9ntalo nuevamente."
      );
      setIsSubmitting(false);
      trackEvent("form_submit_error", { form_id: "prequal", error_message: err?.message || "unknown" });
    }
  };


  // Formatter for cellphone input with smart autofill (+52 prefix strip)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("52") && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith("1") && digits.length === 11) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    updateData("celular", digits);
  };

  // Formatter for name input (prevent numbers and symbols)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "");
    updateData("nombre", filtered);
  };

  // Formatter for email input (trim and lowercase)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData("email", e.target.value.trim().toLowerCase());
  };

  // Check if user selected less than 50k
  const isLessThan50k = formData.amount === "menos_50k";

  // --- Display Formatters for Step 4 Review ---
  const getAmountDisplay = (val?: string) => {
    const opt = prequalificationForm.steps[0].options?.find((o) => o.value === val);
    return opt ? opt.label : val || "—";
  };

  const getDebtTypeDisplay = (val?: string) => {
    const opt = prequalificationForm.steps[1].fields?.tipoDeuda.options.find((o) => o.value === val);
    return opt ? opt.label : val || "—";
  };

  const getInstitutionDisplay = (val?: string, otherName?: string) => {
    if (!val) return "—";
    if (val === "otra_institucion") return otherName || "Otra institución no listada";
    for (const group of currentInstitutionGroups) {
      const opt = group.options.find((o) => o.value === val);
      if (opt) return opt.label;
    }
    for (const list of Object.values(allDebtInstitutions)) {
      const opt = list.find((o) => o.value === val);
      if (opt) return opt.label;
    }
    return val;
  };

  const formatPhoneDisplay = (raw?: string) => {
    if (!raw) return "—";
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    return raw;
  };

  if (studioConfig.mode === "html_embed") {
    return (
      <div className="bg-white border border-[#C9C1D4] rounded-[20px] p-[24px] sm:p-[28px] lg:p-[32px] shadow-xs flex flex-col gap-4">
        <div
          className="w-full overflow-auto rounded-xl"
          dangerouslySetInnerHTML={{ __html: studioConfig.htmlEmbedCode || "" }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#C9C1D4] rounded-[20px] p-[24px] sm:p-[28px] lg:p-[32px] shadow-xs flex flex-col gap-[20px] sm:gap-[24px]">
      {/* Full-width Progress Bar */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
          <span className="font-bold text-[#17131F]">
            Paso {step + 1} de 4
          </span>
          <span className="text-[#5B5266] font-medium">
            {step === 0 && "Monto aproximado"}
            {step === 1 && "Tipo e institución"}
            {step === 2 && "Datos de contacto"}
            {step === 3 && "Confirmación"}
          </span>
        </div>

        {/* Progress Track */}
        <div
          className="w-full h-[6px] bg-[#F0EDF3] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step + 1}
          aria-label="Progreso del formulario de precalificación"
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#5B2C72] to-[#5ECBDB]"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={
          step === 3
            ? handleSubmit
            : (e) => {
                e.preventDefault();
                handleNext();
              }
        }
        className="flex flex-col gap-[18px]"
      >
        {/* STEP 1: Amount Selection */}
        {step === 0 && (
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[6px]">
              <h2 className="m-0 text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#17131F] leading-tight">
                Elige el monto aproximado de tu deuda:
              </h2>
              <p className="m-0 text-[15px] sm:text-[16px] text-[#3A3344] leading-relaxed">
                Con un aproximado es suficiente para empezar.
              </p>
            </div>

            <fieldset className="flex flex-col gap-[10px] mt-1 border-0 p-0 m-0">
              <legend className="sr-only">Selecciona el rango de deuda total aproximado</legend>
              {prequalificationForm.steps[0].options?.map((opt) => {
                const isSelected = formData.amount === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-between min-h-[54px] sm:min-h-[56px] px-[18px] py-[13px] rounded-[12px] cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "border-2 border-[#5B2C72] bg-[#F5EDF9]"
                        : "border border-[#C9C1D4] bg-white hover:border-[#7E4499] hover:bg-[#FBF8FC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="amount"
                      value={opt.value}
                      checked={isSelected}
                      onChange={(e) => updateData("amount", e.target.value)}
                      className="sr-only"
                      required
                    />
                    <span className="text-[15px] sm:text-[16px] font-bold text-[#17131F]">
                      {opt.label}
                    </span>
                    <span
                      className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[5px] border-[#5B2C72] bg-white"
                          : "border-[2px] border-[#C9C1D4]"
                      }`}
                    />
                  </label>
                );
              })}
            </fieldset>

            {/* Contextual Guidance Branch for < $50,000 */}
            {isLessThan50k && (
              <div className="bg-[#E9F8FA] border border-[#BEE7ED] rounded-[12px] p-4 text-[14px] leading-relaxed text-[#16606B] flex flex-col gap-2 mt-1">
                <div className="font-bold text-[#17131F]">
                  Orientación para montos menores a $50,000 MXN
                </div>
                <p className="m-0 text-[#3A3344]">
                  Por el monto que nos compartes, este programa de liquidación con descuento podría no ser la alternativa más adecuada en este momento. Sin embargo, ponemos a tu disposición guías gratuitas para negociar directamente con tu banco o reestructurar tus pagos.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Link
                    href="#recursos"
                    className="inline-flex items-center justify-center bg-white border border-[#BEE7ED] text-[#1E8A9B] font-bold px-4 py-2 rounded-lg text-[13px] hover:bg-[#E9F8FA] transition-colors"
                  >
                    Ver recursos y guías de apoyo
                  </Link>
                  <button
                    type="button"
                    onClick={() => updateData("amount", "")}
                    className="inline-flex items-center justify-center text-[#5B5266] font-medium text-[13px] underline hover:text-[#17131F]"
                  >
                    Cambiar mi respuesta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Debt Type & Cascading Smart Dropdown */}
        {step === 1 && (
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[6px]">
              <h2 className="m-0 text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#17131F] leading-tight">
                ¿Qué tipo de deuda tienes?
              </h2>
              <p className="m-0 text-[15px] sm:text-[16px] text-[#3A3344]">
                Elige la opción principal y selecciona con quién es tu deuda.
              </p>
            </div>

            {/* 5 Debt Type Buttons */}
            <fieldset className="grid grid-cols-2 gap-[10px] mt-1 border-0 p-0 m-0">
              <legend className="sr-only">Tipo de deuda principal</legend>
              {prequalificationForm.steps[1].fields?.tipoDeuda.options.map((opt) => {
                const isSelected = formData.tipoDeuda === opt.value;
                const IconComponent = debtIconMap[opt.value] || OtherDebtIcon;
                return (
                  <label
                    key={opt.value}
                    className={`flex flex-col justify-between p-[14px] sm:p-[16px] min-h-[84px] rounded-[12px] cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "border-2 border-[#5B2C72] bg-[#F5EDF9] shadow-2xs"
                        : "border border-[#C9C1D4] bg-white hover:border-[#7E4499] hover:bg-[#FBF8FC]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoDeuda"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => handleDebtTypeChange(opt.value)}
                      className="sr-only"
                      required
                    />
                    <div className="flex justify-between items-center">
                      <div
                        className={`w-[34px] h-[34px] rounded-[8px] flex items-center justify-center ${
                          isSelected
                            ? "bg-[#5B2C72] text-white"
                            : "bg-[#F5EDF9] text-[#5B2C72]"
                        }`}
                      >
                        <IconComponent size={18} />
                      </div>
                      <span
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[5px] border-[#5B2C72] bg-white"
                            : "border-[2px] border-[#C9C1D4]"
                        }`}
                      />
                    </div>
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#17131F] mt-2">
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {/* Cascading Logic Dropdown */}
            <div className="flex flex-col gap-1.5 mt-2 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <label className="text-[13.5px] font-bold text-[#17131F]">
                  Selecciona con quién es tu deuda: <span className="text-[#B02A24]">*</span>
                </label>
                {formData.institucion && isInstitutionValid && (
                  <span className="text-[12px] font-bold text-[#157A5A] flex items-center gap-1">
                    <CheckIcon size={12} />
                    <span>Seleccionado</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <select
                  className={`w-full p-3.5 pr-10 border rounded-[10px] text-[15px] min-h-[50px] focus:outline-none appearance-none bg-white font-medium cursor-pointer transition-all ${
                    formData.institucion
                      ? "border-[#5B2C72] text-[#17131F] bg-[#FDFBFE]"
                      : "border-[#C9C1D4] text-[#5B5266]"
                  }`}
                  value={formData.institucion || ""}
                  onChange={(e) => updateData("institucion", e.target.value)}
                  required
                >
                  <option value="">{dropdownPlaceholder}</option>
                  {currentInstitutionGroups.map((group) => (
                    <optgroup
                      key={group.group}
                      label={group.group}
                      className="font-bold text-[#5B2C72] bg-[#FBFAFC]"
                    >
                      {group.options.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="text-[#17131F] font-normal py-1"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#5B5266]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Specific Text Field if "Otra institución no listada" was chosen */}
              {formData.institucion === "otra_institucion" && (
                <div className="flex flex-col gap-1 mt-2 animate-in fade-in duration-200">
                  <label className="text-[13px] font-bold text-[#17131F]">
                    Escribe el nombre de tu institución o acreedor: <span className="text-[#B02A24]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Caja Popular, Financiera Local, etc."
                    className="w-full p-3 border border-[#5B2C72] rounded-[10px] text-[15px] focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,44,114,0.14)]"
                    value={formData.otraInstitucionNombre || ""}
                    onChange={(e) => updateData("otraInstitucionNombre", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Contact Info with Candados (Strict Validations) */}
        {step === 2 && (
          <div className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[6px]">
              <h2 className="m-0 text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#17131F] leading-tight">
                ¿A dónde te contactamos?
              </h2>
              <p className="m-0 text-[14px] sm:text-[15px] text-[#3A3344]">
                Un asesor revisará lo que nos compartiste y te llamará para explicarte qué opciones aplican.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-1">
              {/* Campo Nombre */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="bravo-lead-name" className="text-[13.5px] font-bold text-[#17131F]">
                    Nombre(s) <span className="text-[#B02A24]">*</span>
                  </label>
                  {touched.nombre && isNameValid && (
                    <span className="text-[12px] font-bold text-[#157A5A] flex items-center gap-1">
                      <CheckIcon size={12} />
                      <span>Válido</span>
                    </span>
                  )}
                </div>
                <input
                  id="bravo-lead-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  spellCheck={false}
                  required
                  placeholder="Tu nombre completo"
                  maxLength={60}
                  className={`w-full p-3 border rounded-[10px] text-[15px] min-h-[48px] focus:outline-none transition-all ${
                    touched.nombre && !isNameValid
                      ? "border-[#B02A24] bg-[#FFF9F8] focus:border-[#B02A24] focus:shadow-[0_0_0_4px_rgba(176,42,36,0.12)]"
                      : isNameValid
                      ? "border-[#157A5A] bg-[#F1FAF6]/40 focus:border-[#5B2C72]"
                      : "border-[#C9C1D4] focus:border-[#5B2C72] focus:shadow-[0_0_0_4px_rgba(91,44,114,0.14)]"
                  }`}
                  value={formData.nombre || ""}
                  onChange={handleNameChange}
                  onBlur={() => markTouched("nombre")}
                />
                {touched.nombre && !isNameValid && (
                  <span className="text-[12px] text-[#B02A24] font-medium">
                     Ingresa un nombre válido (mínimo 3 letras, sin números ni símbolos).
                  </span>
                )}
              </div>

              {/* Campo Celular con Candado a 10 dígitos numéricos y Autocomplete */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="bravo-lead-phone" className="text-[13.5px] font-bold text-[#17131F]">
                    Celular <span className="text-[#B02A24]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[#5B5266] font-mono">
                      {(formData.celular || "").length}/10 dígitos
                    </span>
                    {touched.celular && isPhoneValid && (
                      <span className="text-[12px] font-bold text-[#157A5A] flex items-center gap-1">
                        <CheckIcon size={12} />
                        <span>Válido</span>
                      </span>
                    )}
                  </div>
                </div>
                <input
                  id="bravo-lead-phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel tel-national"
                  inputMode="tel"
                  pattern="[0-9]*"
                  required
                  placeholder="Ej. 5512345678 (10 dígitos)"
                  maxLength={10}
                  className={`w-full p-3 border rounded-[10px] text-[15px] font-mono min-h-[48px] focus:outline-none transition-all ${
                    touched.celular && !isPhoneValid
                      ? "border-[#B02A24] bg-[#FFF9F8] focus:border-[#B02A24] focus:shadow-[0_0_0_4px_rgba(176,42,36,0.12)]"
                      : isPhoneValid
                      ? "border-[#157A5A] bg-[#F1FAF6]/40 focus:border-[#5B2C72]"
                      : "border-[#C9C1D4] focus:border-[#5B2C72] focus:shadow-[0_0_0_4px_rgba(91,44,114,0.14)]"
                  }`}
                  value={formData.celular || ""}
                  onChange={handlePhoneChange}
                  onBlur={() => markTouched("celular")}
                />
                {touched.celular && !isPhoneValid && (
                  <span className="text-[12px] text-[#B02A24] font-medium">
                    Ingresa exactamente 10 dígitos numéricos reales de tu celular.
                  </span>
                )}
              </div>

              {/* Campo Correo con Candado de Formato y Autocomplete */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="bravo-lead-email" className="text-[13.5px] font-bold text-[#17131F]">
                    Correo electrónico <span className="text-[#B02A24]">*</span>
                  </label>
                  {touched.email && isEmailValid && (
                    <span className="text-[12px] font-bold text-[#157A5A] flex items-center gap-1">
                      <CheckIcon size={12} />
                      <span>Válido</span>
                    </span>
                  )}
                </div>
                <input
                  id="bravo-lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  placeholder="ejemplo@correo.com"
                  className={`w-full p-3 border rounded-[10px] text-[15px] min-h-[48px] focus:outline-none transition-all ${
                    touched.email && !isEmailValid
                      ? "border-[#B02A24] bg-[#FFF9F8] focus:border-[#B02A24] focus:shadow-[0_0_0_4px_rgba(176,42,36,0.12)]"
                      : isEmailValid
                      ? "border-[#157A5A] bg-[#F1FAF6]/40 focus:border-[#5B2C72]"
                      : "border-[#C9C1D4] focus:border-[#5B2C72] focus:shadow-[0_0_0_4px_rgba(91,44,114,0.14)]"
                  }`}
                  value={formData.email || ""}
                  onChange={handleEmailChange}
                  onBlur={() => markTouched("email")}
                />
                {touched.email && !isEmailValid && (
                  <span className="text-[12px] text-[#B02A24] font-medium">
                    Ingresa un correo electrónico válido (ej. usuario@dominio.com).
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Beautifully Formatted Review Summary */}
        {step === 3 && (
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[6px]">
              <h2 className="m-0 text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#17131F] leading-tight">
                Revisemos tus datos
              </h2>
              <p className="m-0 text-[14.5px] text-[#5B5266]">
                Listo. Ya tenemos la información inicial de tu caso para que un asesor te oriente.
              </p>
            </div>

            {/* Structured & Formatted Summary Box */}
            <div className="bg-[#FBFAFC] border border-[#E7E3EC] rounded-[16px] p-[18px] sm:p-[20px] text-[14px] flex flex-col gap-[12px] shadow-2xs">
              {/* Monto Row */}
              <div className="flex justify-between items-center pb-[10px] border-b border-[#F0EDF3]">
                <span className="text-[#5B5266] font-medium">Monto aprox:</span>
                <span className="font-extrabold text-[#5B2C72] text-[14.5px] bg-[#F5EDF9] px-[12px] py-[3px] rounded-full border border-[#DDCBE6]">
                  {getAmountDisplay(formData.amount)}
                </span>
              </div>

              {/* Tipo de Deuda */}
              <div className="flex justify-between items-center pb-[10px] border-b border-[#F0EDF3]">
                <span className="text-[#5B5266] font-medium">Tipo de deuda:</span>
                <span className="font-bold text-[#17131F]">
                  {getDebtTypeDisplay(formData.tipoDeuda)}
                </span>
              </div>

              {/* Institución */}
              <div className="flex justify-between items-center pb-[10px] border-b border-[#F0EDF3]">
                <span className="text-[#5B5266] font-medium">Institución:</span>
                <span className="font-bold text-[#17131F] text-right max-w-[220px]">
                  {getInstitutionDisplay(formData.institucion, formData.otraInstitucionNombre)}
                </span>
              </div>

              {/* Nombre */}
              <div className="flex justify-between items-center pb-[10px] border-b border-[#F0EDF3]">
                <span className="text-[#5B5266] font-medium">Titular:</span>
                <span className="font-bold text-[#17131F]">
                  {formData.nombre}
                </span>
              </div>

              {/* Teléfono */}
              <div className="flex justify-between items-center pb-[10px] border-b border-[#F0EDF3]">
                <span className="text-[#5B5266] font-medium">Celular:</span>
                <span className="font-bold font-mono text-[#17131F]">
                  {formatPhoneDisplay(formData.celular)}
                </span>
              </div>

              {/* Correo */}
              <div className="flex justify-between items-center">
                <span className="text-[#5B5266] font-medium">Correo:</span>
                <span className="font-bold text-[#17131F] text-right break-all max-w-[220px]">
                  {formData.email}
                </span>
              </div>
            </div>

            {/* Privacy Acceptance Checkbox */}
            <div className="flex items-start gap-3 mt-0.5 pt-3 border-t border-[#F0EDF3]">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  id="privacy-check"
                  required
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="peer w-5 h-5 appearance-none border border-[#C9C1D4] rounded-[5px] checked:bg-[#5B2C72] checked:border-[#5B2C72] cursor-pointer"
                />
                <span className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 flex items-center justify-center">
                  <CheckIcon size={12} className="text-white" />
                </span>
              </div>
              <label htmlFor="privacy-check" className="text-[13px] leading-relaxed text-[#3A3344] cursor-pointer">
                Acepto el{" "}
                <Link href="#" className="underline underline-offset-2 hover:text-[#5B2C72]">
                  aviso de privacidad
                </Link>{" "}
                y que un asesor me contacte para revisar mi caso.
              </label>
            </div>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col gap-[10px] mt-1">
          <div className="flex gap-[10px]">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-[22px] py-[14px] border-2 border-[#5B2C72] text-[#5B2C72] font-bold text-[16px] rounded-full hover:bg-[#F5EDF9] transition-colors disabled:opacity-50"
              >
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !isStepValid}
              className="flex-1 py-[15px] bg-[#5B2C72] text-white font-bold text-[16px] text-center rounded-full hover:bg-[#45205A] transition-all flex items-center justify-center gap-2 disabled:bg-[#EAE5EF] disabled:text-[#8A8095] disabled:cursor-not-allowed shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Enviando…
                </>
              ) : step === 3 ? (
                "Solicitar evaluación"
              ) : (
                "Continuar"
              )}
            </button>
          </div>

          {/* Clean Public Microcopy */}
          <div className="text-center text-[12px] text-[#5B5266] pt-1">
            Usaremos esta información para revisar tu caso y dar seguimiento a tu solicitud conforme a nuestro{" "}
            <Link href="#" className="underline hover:text-[#17131F]">
              Aviso de Privacidad
            </Link>.
          </div>

          {/* Error Message (shown on API failure) */}
          {submitError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex flex-col gap-2 bg-[#FFF9F8] border border-[#F0C9C6] rounded-[12px] p-4 mt-1"
            >
              <span className="text-[13px] font-bold text-[#8C201B]">
                No pudimos procesar tu solicitud
              </span>
              <span className="text-[12.5px] text-[#3A3344] leading-relaxed">
                {submitError}
              </span>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="self-start text-[12px] font-bold text-[#5B2C72] underline underline-offset-2 hover:text-[#45205A] mt-1"
              >
                Intentar nuevamente
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
