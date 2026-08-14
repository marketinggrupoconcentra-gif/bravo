import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_bBGYmj0w8qsU@ep-shy-wildflower-aw8lm8ot-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);

async function clearData() {
  console.log("Limpiando todos los datos de muestra...");
  await sql`DELETE FROM leads;`;
  await sql`DELETE FROM analytics_events;`;
  console.log("Base de datos limpia y lista para producción (0 leads de prueba, 0 eventos de prueba).");
}

clearData().catch((err) => {
  console.error("Error al limpiar datos:", err);
  process.exit(1);
});
