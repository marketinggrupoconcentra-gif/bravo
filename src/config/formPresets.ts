export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormStepConfig {
  id: string;
  title: string;
  question: string;
  helperText?: string;
  options?: FormFieldOption[];
}

export interface FormStudioConfig {
  mode: "native" | "html_embed";
  htmlEmbedCode?: string;
  webhookEnabled?: boolean;
  webhookUrl?: string;
  webhookMethod?: "POST" | "PUT";
  webhookHeaders?: Array<{ key: string; value: string }>;
  webhookFormat?: "json" | "form_data";
  customRedirectEnabled?: boolean;
  customRedirectUrl?: string;
  title: string;
  subtitle: string;
  minDebtText: string;
  continueBtnText: string;
  submitBtnText: string;
  redirectUrl: string;
  privacyText: string;
  steps: FormStepConfig[];
}

export const DEFAULT_FORM_STUDIO_CONFIG: FormStudioConfig = {
  mode: "native",
  htmlEmbedCode: `<!-- Ejemplo de Formulario Embebido por HTML / Iframe -->\n<div class="custom-bravo-embed p-6 bg-white rounded-2xl border border-[#E7E3EC] text-center">\n  <h3 class="text-xl font-bold text-[#17131F] mb-2">Formulario Conectado por HTML</h3>\n  <p class="text-sm text-[#5B5266] mb-4">Pega aquí el código provisto por tu CRM (HubSpot, Typeform, Webflow o Google Forms).</p>\n  <form action="#" method="POST" class="flex flex-col gap-3 max-w-md mx-auto">\n    <input type="text" placeholder="Tu nombre completo" class="p-3 border rounded-xl text-sm" required />\n    <input type="tel" placeholder="Tu celular a 10 dígitos" class="p-3 border rounded-xl text-sm" required />\n    <button type="submit" class="bg-[#5B2C72] text-white font-bold p-3 rounded-xl hover:bg-[#45205A]">Enviar Formulario</button>\n  </form>\n</div>`,
  webhookEnabled: false,
  webhookUrl: "",
  webhookMethod: "POST",
  webhookHeaders: [{ key: "Authorization", value: "" }],
  webhookFormat: "json",
  customRedirectEnabled: false,
  customRedirectUrl: "",
  title: "Revisemos tu situación y conoce tus opciones reales",
  subtitle: "Responde unas preguntas breves. Un asesor especializado analiza tu caso sin costo ni compromiso.",
  minDebtText: "Deudas desde $50,000 MXN · sin consulta al buró en este paso",
  continueBtnText: "Continuar",
  submitBtnText: "Revisar mi caso sin costo",
  redirectUrl: "/gracias",
  privacyText: "Tus datos están protegidos conforme a nuestro Aviso de Privacidad y no serán compartidos.",
  steps: [
    {
      id: "amount",
      title: "Monto aproximado de deuda",
      question: "Elige el monto aproximado de tu deuda:",
      helperText: "Con un aproximado es suficiente para empezar.",
      options: [
        { value: "menos_50k", label: "Menos de $50,000" },
        { value: "50k_75k", label: "$50,000 – $75,000" },
        { value: "75k_100k", label: "$75,000 – $100,000" },
        { value: "100k_250k", label: "$100,000 – $250,000" },
        { value: "250k_500k", label: "$250,000 – $500,000" },
        { value: "500k_1m", label: "$500,000 – $1,000,000" },
        { value: "mas_1m", label: "Más de $1,000,000" },
      ],
    },
    {
      id: "debtInfo",
      title: "Tipo de crédito y acreedor",
      question: "¿A qué institución le debes principalmente?",
      helperText: "Gestionamos convenios formales con los principales bancos y tiendas.",
      options: [
        { value: "tarjeta_credito", label: "Tarjeta de crédito" },
        { value: "prestamo_personal", label: "Préstamo personal o nómina" },
        { value: "tarjeta_departamental", label: "Tarjeta departamental (Liverpool, SEARS, etc.)" },
        { value: "credito_automotriz", label: "Crédito automotriz" },
        { value: "otro", label: "Otro tipo de crédito" },
      ],
    },
    {
      id: "arrears",
      title: "Situación de pagos y atraso",
      question: "¿En qué situación de pago te encuentras hoy?",
      helperText: "Esto nos permite definir la mejor estrategia legal de negociación.",
      options: [
        { value: "al_corriente", label: "Estoy al corriente pero ya me cuesta mucho pagar el mínimo" },
        { value: "atraso_1_3_meses", label: "Tengo entre 1 y 3 meses de atraso" },
        { value: "atraso_mas_3_meses", label: "Tengo más de 3 meses de atraso" },
        { value: "cobranza_despacho", label: "Mi cuenta ya pasó a despacho de cobranza" },
      ],
    },
    {
      id: "contact",
      title: "Datos de contacto del titular",
      question: "¿A dónde enviamos tu diagnóstico de ahorro?",
      helperText: "Un asesor senior te contactará en horario hábil para revisar números.",
    },
  ],
};

export const FORM_PRESETS: { id: string; name: string; desc: string; config: FormStudioConfig }[] = [
  {
    id: "bravo_standard_4steps",
    name: "Estándar Bravo México (4 Pasos)",
    desc: "Flujo completo de calificación: Monto, Institución, Situación de atraso y Contacto.",
    config: DEFAULT_FORM_STUDIO_CONFIG,
  },
  {
    id: "bravo_express_2steps",
    name: "Flujo Rápido Express (2 Pasos)",
    desc: "Optimizado para máxima conversión: Solo Monto de deuda y Contacto directo.",
    config: {
      ...DEFAULT_FORM_STUDIO_CONFIG,
      title: "Solicita tu diagnóstico de liquidación rápido",
      subtitle: "Ingresa tu monto y un asesor te llamará en minutos.",
      steps: [
        DEFAULT_FORM_STUDIO_CONFIG.steps[0],
        DEFAULT_FORM_STUDIO_CONFIG.steps[3],
      ],
    },
  },
  {
    id: "bravo_tarjetas_credito",
    name: "Especializado en Tarjetas de Crédito",
    desc: "Enfocado en liquidar múltiples tarjetas bancarias con quita.",
    config: {
      ...DEFAULT_FORM_STUDIO_CONFIG,
      title: "Liquida tus Tarjetas de Crédito con Descuento",
      subtitle: "Negociamos directamente con BBVA, Citibanamex, Santander, HSBC y Banorte.",
      steps: [
        {
          ...DEFAULT_FORM_STUDIO_CONFIG.steps[0],
          question: "¿Cuánto sumas en tus tarjetas de crédito en total?",
        },
        DEFAULT_FORM_STUDIO_CONFIG.steps[1],
        DEFAULT_FORM_STUDIO_CONFIG.steps[2],
        DEFAULT_FORM_STUDIO_CONFIG.steps[3],
      ],
    },
  },
  {
    id: "bravo_departamental",
    name: "Tiendas Departamentales y Financieras",
    desc: "Especializado en deudas con Liverpool, Palacio de Hierro, Suburbia, Coppel y Fintechs.",
    config: {
      ...DEFAULT_FORM_STUDIO_CONFIG,
      title: "Resuelve deudas de Tiendas Departamentales",
      subtitle: "Un plan legal para frenar intereses y convenir pagos alcanzables.",
      steps: DEFAULT_FORM_STUDIO_CONFIG.steps,
    },
  },
];
