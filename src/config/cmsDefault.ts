export interface CmsSectionConfig {
  id: string;
  pageSlug: string;
  pageName: string;
  sectionId: string;
  sectionName: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundStyle?: "default" | "dark-purple" | "light-offwhite" | "aurora-glow" | "pure-white";
  buttonStyle?: "primary-purple" | "cyan-glow" | "emerald-success" | "glass-border" | "minimal-white";
  buttonBorderRadius?: "full" | "lg" | "sm" | "none";
  themeMode?: "light" | "dark";
  customColors?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  animationConfig?: {
    wavesEnabled?: boolean;
    glowEnabled?: boolean;
    speed?: "slow" | "normal" | "fast" | "none";
  };
  formConfig?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    minDebtText?: string;
    privacyBadge?: string;
  };
  customFields?: Record<string, string>;
}

export const DEFAULT_CMS_SECTIONS: Record<string, CmsSectionConfig> = {
  // --- HOMEPAGE SECTIONS ---
  "home_hero": {
    id: "home_hero",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "hero",
    sectionName: "Hero Principal",
    badge: "PROGRAMA DE LIQUIDACIÓN Y AHORRO EN MÉXICO",
    title: "Una alternativa real para resolver tus deudas sin poner en riesgo tu patrimonio",
    subtitle: "Analizamos tu caso y diseñamos un plan de ahorro a tu medida para negociar descuentos directos con tus acreedores.",
    primaryCtaText: "Revisar mi caso",
    primaryCtaUrl: "/formulario",
    secondaryCtaText: "Conoce cómo funciona",
    secondaryCtaUrl: "/como-funciona",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "home_process": {
    id: "home_process",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "process",
    sectionName: "Proceso de 4 Pasos",
    badge: "PASO A PASO CON BRAVO",
    title: "Cómo funciona el plan de liquidación",
    subtitle: "Un método transparente y ordenado para recuperar tu tranquilidad financiera.",
    primaryCtaText: "Comenzar mi evaluación",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "home_advisor": {
    id: "home_advisor",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "advisor",
    sectionName: "Sección Asesoría Humana",
    badge: "ACOMPAÑAMIENTO PROFESIONAL",
    title: "Asesoría personalizada y cercana desde el primer día",
    subtitle: "No estás solo. Un asesor especializado revisa tu situación y te acompaña en cada etapa de la negociación con tus acreedores.",
    primaryCtaText: "Hablar con un asesor",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "aurora-glow",
    themeMode: "light",
  },
  "home_calculator": {
    id: "home_calculator",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "calculator",
    sectionName: "Simulador / Calculadora",
    badge: "SIMULADOR PEDAGÓGICO",
    title: "Simula tu plan de ahorro estimado",
    subtitle: "Mueve los controles para estimar el porcentaje aproximado de descuento y tu mensualidad sugerida.",
    primaryCtaText: "Solicitar este plan",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "home_faq": {
    id: "home_faq",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "faq",
    sectionName: "Preguntas Frecuentes (FAQ)",
    badge: "PREGUNTAS FRECUENTES",
    title: "Respuestas claras a dudas comunes",
    subtitle: "Todo lo que necesitas saber antes de iniciar tu plan de liquidación y ahorro con Bravo.",
    primaryCtaText: "Consultar con un asesor",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "light-offwhite",
    themeMode: "light",
  },
  "home_final_cta": {
    id: "home_final_cta",
    pageSlug: "home",
    pageName: "Página Principal (Inicio)",
    sectionId: "final_cta",
    sectionName: "Cierre / CTA Final",
    badge: "Plan de ahorro y negociación personalizada",
    title: "¿Quieres entender qué opciones pueden aplicar a tu situación?",
    subtitle: "Responde unas preguntas breves en menos de dos minutos para que un asesor especializado revise tu caso sin costo ni compromiso.",
    primaryCtaText: "Revisar mi caso",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "dark-purple",
    themeMode: "dark",
  },

  // --- DEDICATED ROUTES ---
  "soluciones_hero": {
    id: "soluciones_hero",
    pageSlug: "soluciones",
    pageName: "Página de Soluciones (/soluciones)",
    sectionId: "hero",
    sectionName: "Hero de Soluciones",
    badge: "SOLUCIONES INTEGRALES",
    title: "Soluciones de Liquidación de Deudas en México",
    subtitle: "Conoce nuestros programas especializados para negociar y liquidar deudas de tarjetas de crédito, préstamos personales y créditos departamentales.",
    primaryCtaText: "Evaluar mi deuda",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "tipos_deuda_hero": {
    id: "tipos_deuda_hero",
    pageSlug: "tipos-de-deuda",
    pageName: "Tipos de Deuda (/tipos-de-deuda)",
    sectionId: "hero",
    sectionName: "Hero de Tipos de Deuda",
    badge: "COBERTURA COMPLETA",
    title: "Tipos de Créditos que Liquidamos en México",
    subtitle: "Gestionamos negociaciones formales con los principales bancos, tiendas departamentales y financieras del país.",
    primaryCtaText: "Revisar mi crédito",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "como_funciona_hero": {
    id: "como_funciona_hero",
    pageSlug: "como-funciona",
    pageName: "Cómo Funciona (/como-funciona)",
    sectionId: "hero",
    sectionName: "Hero de Cómo Funciona",
    badge: "METODOLOGÍA TRANSPARENTE",
    title: "Cómo Funciona el Programa Bravo México",
    subtitle: "Un proceso claro de 4 fases para negociar quitas legales y liquidar tus adeudos mediante ahorro mensual programado.",
    primaryCtaText: "Iniciar diagnóstico",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "requisitos_hero": {
    id: "requisitos_hero",
    pageSlug: "requisitos",
    pageName: "Requisitos (/requisitos)",
    sectionId: "hero",
    sectionName: "Hero de Requisitos",
    badge: "CRITERIOS DE ADMISIÓN",
    title: "Requisitos para Entrar al Plan de Liquidación",
    subtitle: "Conoce los criterios y documentos indispensables para iniciar tu plan de liquidación y negociación con Bravo México.",
    primaryCtaText: "Validar mis requisitos",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "casos_hero": {
    id: "casos_hero",
    pageSlug: "casos",
    pageName: "Casos de Éxito (/casos)",
    sectionId: "hero",
    sectionName: "Hero de Casos",
    badge: "RESULTADOS COMPROBADOS",
    title: "Casos de Liquidación y Ahorro en México",
    subtitle: "Conoce testimonios reales y simula el impacto de un plan de negociación estructurado frente al pago de mínimos bancarios.",
    primaryCtaText: "Calcular mi caso",
    primaryCtaUrl: "/simulador-de-liquidacion",
    backgroundStyle: "default",
    themeMode: "light",
  },
  "recursos_hero": {
    id: "recursos_hero",
    pageSlug: "recursos",
    pageName: "Recursos y Guías (/recursos)",
    sectionId: "hero",
    sectionName: "Hero de Recursos",
    badge: "EDUCACIÓN FINANCIERA",
    title: "Guías y Recursos sobre Deudas en México",
    subtitle: "Artículos técnicos, comparativas y procedimientos legales para entender tus derechos y tomar decisiones con certeza.",
    primaryCtaText: "Iniciar evaluación",
    primaryCtaUrl: "/formulario",
    backgroundStyle: "default",
    themeMode: "light",
  },
};
