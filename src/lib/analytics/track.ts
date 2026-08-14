import { EventName, EventParamsMap } from "./events";
import { logUserAction } from "@/lib/telemetry/logger";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify?: (params?: Record<string, unknown>) => void;
    };
    clarity?: (...args: unknown[]) => void;
    hj?: (...args: unknown[]) => void;
  }
}

export function trackEvent<T extends EventName>(
  eventName: T,
  parameters?: EventParamsMap[T]
) {
  if (typeof window === "undefined") return;

  // Initialize dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // PII Safety Check: Prevent any raw sensitive personal data from leaking into public analytics
  const safeParameters = { ...parameters } as Record<string, unknown>;
  const blockedKeys = [
    "email",
    "phone",
    "telefono",
    "celular",
    "nombre",
    "apellido",
    "name",
    "rfc",
    "curp",
    "password",
    "token",
  ];

  if (parameters) {
    for (const key of Object.keys(parameters)) {
      if (blockedKeys.some((blocked) => key.toLowerCase().includes(blocked))) {
        delete safeParameters[key];
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[Analytics Safety] Blocked PII field: ${key}`);
        }
      }
    }
  }

  const payload = {
    event: eventName,
    ...safeParameters,
    timestamp: new Date().toISOString(),
  };

  // =========================================================================
  // 1. Google Tag Manager (GTM) dataLayer Push
  // =========================================================================
  window.dataLayer.push(payload);

  // =========================================================================
  // 2. Google Analytics 4 (GA4) Standard Event Dispatch
  // =========================================================================
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, safeParameters);
  }

  // =========================================================================
  // 3. Meta Pixel (Facebook / Instagram) Standard Event Mapping & Parameters
  // =========================================================================
  if (typeof window.fbq === "function") {
    try {
      switch (eventName) {
        case "page_view":
          window.fbq("track", "PageView");
          break;

        case "generate_lead":
        case "prequalification_complete":
          // Official Meta Standard Event: Lead
          window.fbq("track", "Lead", {
            content_name: "Solicitud Liquidación de Deudas Bravo",
            content_category: "Servicios Financieros",
            value: Number(safeParameters.estimated_value) || 75000,
            currency: "MXN",
            status: "prequalified",
          });
          // Also fire CompleteRegistration
          window.fbq("track", "CompleteRegistration", {
            content_name: "Formulario Precalificación Bravo",
            status: true,
            currency: "MXN",
          });
          break;

        case "form_step_view":
          // When entering step 3 (Personal data) -> InitiateCheckout
          if (safeParameters.step_number === 3) {
            window.fbq("track", "InitiateCheckout", {
              content_name: "Llenado de Datos Bravo",
              currency: "MXN",
            });
          } else {
            window.fbq("trackCustom", `FormStep_${safeParameters.step_number || 1}`, safeParameters);
          }
          break;

        case "outbound_click":
          // WhatsApp or phone clicks -> Contact
          if (
            typeof safeParameters.url === "string" &&
            (safeParameters.url.includes("wa.me") || safeParameters.url.includes("whatsapp"))
          ) {
            window.fbq("track", "Contact", {
              content_name: "Boton WhatsApp Contacto",
              method: "whatsapp",
            });
          }
          break;

        case "calculator_interaction":
          window.fbq("trackCustom", "SimuladorLiquidacion", {
            amount: safeParameters.amount,
            savings: safeParameters.monthly_savings,
            currency: "MXN",
          });
          break;

        default:
          window.fbq("trackCustom", eventName, safeParameters);
          break;
      }
    } catch {
      // safe fallback
    }
  }

  // =========================================================================
  // 4. TikTok Pixel Standard Event Mapping
  // =========================================================================
  if (typeof window.ttq === "object" && typeof window.ttq.track === "function") {
    try {
      switch (eventName) {
        case "page_view":
          window.ttq.page();
          break;

        case "generate_lead":
        case "prequalification_complete":
          // Official TikTok Standard Event: SubmitForm
          window.ttq.track("SubmitForm", {
            contents: [
              {
                content_id: String(safeParameters.debt_range || "debt_plan"),
                content_type: "product",
                content_name: "Programa Bravo Liquidacion",
              },
            ],
            value: Number(safeParameters.estimated_value) || 75000,
            currency: "MXN",
          });
          break;

        case "outbound_click":
          if (
            typeof safeParameters.url === "string" &&
            (safeParameters.url.includes("wa.me") || safeParameters.url.includes("whatsapp"))
          ) {
            window.ttq.track("Contact");
          }
          break;

        case "form_start":
          window.ttq.track("ViewContent", {
            content_name: "Formulario Bravo",
          });
          break;

        default:
          break;
      }
    } catch {
      // safe fallback
    }
  }

  // =========================================================================
  // 5. Internal Telemetry Engine for Admin Dashboard
  // =========================================================================
  logUserAction(eventName, safeParameters);

  // Development debugging log
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `%c[Analytics Event: ${eventName}]`,
      "color: #5ECBDB; font-weight: bold;",
      payload
    );
  }
}
