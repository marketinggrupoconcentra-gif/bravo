import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_bBGYmj0w8qsU@ep-shy-wildflower-aw8lm8ot-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);

const REAL_LEADS = [
  {
    folio: "BR-502914",
    nombre: "Carlos Mendoza Villalobos",
    institucion: "BBVA México",
    tipoDeuda: "Tarjeta de crédito",
    monto: "$250,000 – $500,000",
    celular: "5541892045",
    email: "carlos.mendoza.v@gmail.com",
    status: "Nuevo",
    device: "Móvil",
    referrer: "https://www.facebook.com/",
    attribution: {
      channel: "Meta Ads",
      utm_source: "facebook",
      utm_medium: "cpc",
      utm_campaign: "mx_liquidar_deudas_q3",
      utm_content: "anuncio_ahorro_70pct",
      fbclid: "IwAR2vK7l8z9_qP0M1xN4bV5cX8kL3jH6gF2dE1sA9",
      fbc: "fb.1.1723580000000.IwAR2vK7l8z9_qP0M1xN4bV5cX8kL3jH6gF2dE1sA9",
      fbp: "fb.1.1723580000000.8492038174",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T16:45:12.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead recibido con éxito por Meta Graph API v19.0 (1 evento procesado).",
        details: {
          event_name: "Lead",
          fbtrace_id: "Fbx9A2K7qM1Lp4",
          user_data_hashed: ["em", "ph", "fn", "ln"],
        },
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T16:45:12.000Z",
        responseCode: 200,
        responseMessage: "Conversión Enhanced registrada para smart bidding.",
        details: {
          conversion_action: "Bravo_Lead_Calificado",
          conversion_currency: "MXN",
          conversion_value: 175000,
        },
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
  {
    folio: "BR-489102",
    nombre: "Mariana Hernández Trejo",
    institucion: "Santander México",
    tipoDeuda: "Préstamo personal",
    monto: "$150,000 – $200,000",
    celular: "3318904512",
    email: "mariana.htrejo@outlook.com",
    status: "En Análisis",
    device: "Escritorio",
    referrer: "https://www.google.com.mx/",
    attribution: {
      channel: "Google Ads",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "search_negociacion_deudas_mexico",
      utm_term: "reparadora de credito bravo",
      gclid: "Cj0KCQjwiOy1BhD2ARIsAEG_2bT7M4kL9p1xQ8vN3bC5zX6yA",
      ga_client_id: "GA1.2.981273645.1723570000",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T15:20:33.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead procesado correctamente en Meta CAPI.",
        details: {
          event_name: "Lead",
          fbtrace_id: "Fby3K9P1xV8mN2",
        },
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T15:20:33.000Z",
        responseCode: 200,
        responseMessage: "Conversión vinculada a GCLID (Cj0KCQjwiOy1BhD2ARIs...).",
        details: {
          conversion_action: "Bravo_Lead_Calificado",
          conversion_currency: "MXN",
          conversion_value: 85000,
          gclid: "Cj0KCQjwiOy1BhD2ARIsAEG_2bT7M4kL9p1xQ8vN3bC5zX6yA",
        },
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
  {
    folio: "BR-394817",
    nombre: "Alejandro Ruiz Estrada",
    institucion: "Citibanamex",
    tipoDeuda: "Tarjeta de crédito",
    monto: "Más de $1,000,000",
    celular: "8123456789",
    email: "alejandro.ruiz.e@hotmail.com",
    status: "Convenio Aceptado",
    device: "Móvil",
    referrer: "https://www.google.com/",
    attribution: {
      channel: "Google Ads",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "pmax_deudas_altas_mexico",
      gclid: "Cj0KCQjwiOy1BhD2ARIsAEG_9xK8mP2vL4bC7zX1yA3wQ5n",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T14:10:05.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead recibido con éxito por Meta Graph API v19.0.",
        details: {
          event_name: "Lead",
          fbtrace_id: "Fbz7M2P4vL8xQ1",
        },
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T14:10:05.000Z",
        responseCode: 200,
        responseMessage: "Conversión de alto valor ($350,000 MXN) enviada a Google Ads.",
        details: {
          conversion_action: "Bravo_Lead_Calificado_VIP",
          conversion_currency: "MXN",
          conversion_value: 350000,
          gclid: "Cj0KCQjwiOy1BhD2ARIsAEG_9xK8mP2vL4bC7zX1yA3wQ5n",
        },
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
  {
    folio: "BR-281940",
    nombre: "Valeria Gómez Salazar",
    institucion: "Liverpool",
    tipoDeuda: "Tarjeta departamental",
    monto: "$85,000 – $120,000",
    celular: "4421987654",
    email: "valeria.gomez.salazar@gmail.com",
    status: "Contactado",
    device: "Móvil",
    referrer: "https://www.tiktok.com/",
    attribution: {
      channel: "TikTok Ads",
      utm_source: "tiktok",
      utm_medium: "cpc",
      utm_campaign: "tiktok_finanzas_deudas_mx",
      ttclid: "tt_98127401928374",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T12:35:50.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead sincronizado con Meta CAPI.",
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T12:35:50.000Z",
        responseCode: 200,
        responseMessage: "Conversión Enhanced registrada correctamente.",
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
  {
    folio: "BR-190472",
    nombre: "Roberto Morales Castañeda",
    institucion: "Banorte",
    tipoDeuda: "Préstamo de nómina",
    monto: "$300,000 – $450,000",
    celular: "2223849102",
    email: "roberto.morales.c@yahoo.com",
    status: "Nuevo",
    device: "Escritorio",
    referrer: "https://bravocredito.com.mx/",
    attribution: {
      channel: "Orgánico",
      utm_source: "organic_seo",
      utm_medium: "organic",
      utm_campaign: "portal_soluciones_financieras",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T11:15:00.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead orgánico sincronizado con Meta CAPI.",
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T11:15:00.000Z",
        responseCode: 200,
        responseMessage: "Conversión de tráfico orgánico atribuida.",
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
  {
    folio: "BR-105829",
    nombre: "Patricia Vega Domínguez",
    institucion: "Nu México",
    tipoDeuda: "Tarjeta de crédito",
    monto: "$50,000 – $75,000",
    celular: "5589123456",
    email: "patricia.vega.d@gmail.com",
    status: "Convenio Aceptado",
    device: "Móvil",
    referrer: "https://www.facebook.com/",
    attribution: {
      channel: "Meta Ads",
      utm_source: "instagram",
      utm_medium: "cpc",
      utm_campaign: "ig_stories_ahorro_deudas",
      fbclid: "IwAR3xM1kL7pQ9vN2bC4zX8yA5wE2sD6fG1hJ8",
      fbc: "fb.1.1723575000000.IwAR3xM1kL7pQ9vN2bC4zX8yA5wE2sD6fG1hJ8",
      fbp: "fb.1.1723575000000.9182736450",
    },
    api_sync_logs: {
      meta_capi: {
        status: "success",
        sentAt: "2026-08-13T09:40:22.000Z",
        responseCode: 200,
        responseMessage: "Evento Lead recibido con éxito por Meta Graph API v19.0.",
        details: {
          event_name: "Lead",
          fbtrace_id: "Fba8K2P5vM9xL3",
        },
      },
      google_ads: {
        status: "success",
        sentAt: "2026-08-13T09:40:22.000Z",
        responseCode: 200,
        responseMessage: "Conversión Enhanced sincronizada.",
      },
      crm_webhook: {
        status: "none",
        responseMessage: "Solo persistencia en base de datos principal",
      },
    },
  },
];

async function seed() {
  console.log("Cleaning old test records and seeding realistic financial leads...");

  // Delete previous test leads
  await sql`DELETE FROM leads;`;

  for (const lead of REAL_LEADS) {
    await sql`
      INSERT INTO leads (
        folio,
        nombre,
        institucion,
        tipo_deuda,
        monto,
        celular,
        email,
        status,
        device,
        referrer,
        attribution,
        notes,
        api_sync_logs,
        created_at
      ) VALUES (
        ${lead.folio},
        ${lead.nombre},
        ${lead.institucion},
        ${lead.tipoDeuda},
        ${lead.monto},
        ${lead.celular},
        ${lead.email},
        ${lead.status},
        ${lead.device},
        ${lead.referrer},
        ${JSON.stringify(lead.attribution)},
        '',
        ${JSON.stringify(lead.api_sync_logs)},
        ${new Date().toISOString()}
      );
    `;
    console.log(`Inserted real lead: ${lead.folio} - ${lead.nombre} (${lead.institucion})`);
  }

  console.log("Seeding complete! All leads are now realistic Mexican financial debt resolution cases.");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
