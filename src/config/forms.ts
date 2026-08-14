export interface OptionItem {
  value: string;
  label: string;
}

export interface InstitutionGroup {
  group: string;
  options: OptionItem[];
}

export const allDebtInstitutions: Record<string, OptionItem[]> = {
  bancos: [
    { value: "bbva", label: "BBVA" },
    { value: "banamex", label: "Banamex" },
    { value: "santander", label: "Santander" },
    { value: "banorte", label: "Banorte" },
    { value: "hsbc", label: "HSBC" },
    { value: "scotiabank", label: "Scotiabank" },
    { value: "amex", label: "Amex (American Express)" },
    { value: "nu_mexico", label: "Nu México" },
    { value: "rappicard", label: "RappiCard" },
    { value: "banregio", label: "Banregio" },
    { value: "afirme", label: "Afirme" },
    { value: "banco_del_bajio", label: "Banco del Bajío" },
    { value: "bradescard", label: "Bradescard" },
    { value: "compartamos", label: "Compartamos Banco" },
    { value: "credomatic", label: "CREDOMATIC" },
    { value: "mercado_credito", label: "Mercado Crédito" },
    { value: "didi_prestamos", label: "Didi Préstamos" },
    { value: "coordinadora_rec", label: "Coordinadora Rec (CORESA)" },
    { value: "credito_familiar_sa", label: "Crédito Familiar S.A. de C.V." },
    { value: "exitus", label: "Exitus" },
    { value: "grafeno", label: "GRAFENO" },
    { value: "la_tasa", label: "La Tasa" },
    { value: "prestamos_santander", label: "Préstamos Santander" },
    { value: "prr", label: "PRR" },
    { value: "sicme", label: "SICME" },
  ],
  tiendas: [
    { value: "liverpool", label: "Liverpool" },
    { value: "sears", label: "SEARS" },
    { value: "palacio_de_hierro", label: "Palacio de Hierro" },
    { value: "suburbia", label: "Suburbia" },
    { value: "sanborns", label: "Sanborns" },
    { value: "bodega_aurrera", label: "Bodega Aurrera" },
    { value: "walmart", label: "Walmart" },
    { value: "sams", label: "Sam's Club" },
    { value: "soriana_falabella", label: "Soriana Falabella" },
    { value: "c_and_a", label: "C&A" },
    { value: "bradescard_tiendas", label: "Bradescard (C&A, Promoda, Suburbia)" },
  ],
  financieras: [
    { value: "kueski", label: "Kueski" },
    { value: "yo_te_presto", label: "Yo te presto" },
    { value: "kubo", label: "Kubo Financiero" },
    { value: "creditea", label: "Creditea" },
    { value: "afluenta", label: "Afluenta" },
    { value: "dimex", label: "Dimex" },
    { value: "exitus_nomina", label: "Exitus Nómina" },
    { value: "credito_familiar", label: "Crédito Familiar" },
    { value: "didi_financiera", label: "Didi Préstamos / Fintech" },
    { value: "mercado_credito_fin", label: "Mercado Crédito" },
  ],
  automotriz: [
    { value: "gm_financial", label: "GM Financial" },
    { value: "nr_finance", label: "NR Finance (Nissan / Renault)" },
    { value: "banamex_als", label: "Banamex ALS / Autos" },
    { value: "bbva_auto", label: "BBVA Auto" },
    { value: "banorte_auto", label: "Banorte Auto" },
    { value: "santander_auto", label: "Santander Auto" },
    { value: "hsbc_auto", label: "HSBC Auto" },
    { value: "scotiabank_auto", label: "Scotiabank Auto" },
    { value: "bnp_auto", label: "BNP Paribas Personal Finance" },
    { value: "maxicash", label: "Maxicash" },
  ],
};

/**
 * Returns tailored and prioritized institution groups based on the selected debt type
 */
export function getInstitutionsByDebtType(debtType?: string): InstitutionGroup[] {
  const fallbackOption: OptionItem = {
    value: "otra_institucion",
    label: "Otra institución no listada",
  };

  switch (debtType) {
    case "tarjeta_credito":
      return [
        { group: "Bancos Principales (Tarjetas de Crédito)", options: allDebtInstitutions.bancos },
        { group: "Fintech & Otras Tarjetas", options: allDebtInstitutions.financieras },
        { group: "Otra", options: [fallbackOption] },
      ];
    case "tarjeta_departamental":
      return [
        { group: "Tiendas Departamentales y Comerciales", options: allDebtInstitutions.tiendas },
        { group: "Bancos con Tarjetas Comerciales", options: allDebtInstitutions.bancos.slice(0, 8) },
        { group: "Otra", options: [fallbackOption] },
      ];
    case "prestamo_personal":
      return [
        { group: "Instituciones Financieras & Préstamos Personales", options: allDebtInstitutions.financieras },
        { group: "Bancos (Préstamos Personales y Nómina)", options: allDebtInstitutions.bancos },
        { group: "Otra", options: [fallbackOption] },
      ];
    case "credito_automotriz":
      return [
        { group: "Financieras y Créditos Automotrices", options: allDebtInstitutions.automotriz },
        { group: "Bancos", options: allDebtInstitutions.bancos.slice(0, 6) },
        { group: "Otra", options: [fallbackOption] },
      ];
    default:
      return [
        { group: "Bancos", options: allDebtInstitutions.bancos },
        { group: "Tiendas Departamentales", options: allDebtInstitutions.tiendas },
        { group: "Instituciones Financieras", options: allDebtInstitutions.financieras },
        { group: "Crédito Automotriz", options: allDebtInstitutions.automotriz },
        { group: "Otra", options: [fallbackOption] },
      ];
  }
}

export function getDropdownPlaceholder(debtType?: string): string {
  switch (debtType) {
    case "tarjeta_credito":
      return "Elige tu banco (ej. BBVA, Banamex, Nu, Santander...)";
    case "tarjeta_departamental":
      return "Elige tu tienda (ej. Liverpool, SEARS, Suburbia...)";
    case "prestamo_personal":
      return "Elige tu financiera o banco (ej. Kueski, BBVA, Dimex...)";
    case "credito_automotriz":
      return "Elige tu financiera automotriz (ej. GM Financial, NR Finance...)";
    default:
      return "Elige una institución";
  }
}

export const prequalificationForm = {
  steps: [
    {
      id: "amount",
      title: "Monto de deuda",
      question: "¿Cuánto debes aproximadamente?",
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
      title: "Información de deuda",
      fields: {
        tipoDeuda: {
          label: "Tipo de deuda",
          options: [
            { value: "tarjeta_credito", label: "Tarjeta de crédito" },
            { value: "prestamo_personal", label: "Préstamo personal" },
            { value: "tarjeta_departamental", label: "Tarjeta departamental" },
            { value: "credito_automotriz", label: "Crédito automotriz" },
            { value: "otro", label: "Otro" },
          ],
        },
      },
    },
  ],
};
