import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_bBGYmj0w8qsU@ep-shy-wildflower-aw8lm8ot-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function run() {
  try {
    const claims = await sql`SELECT * FROM claims_registry`;
    console.log("Claims:", claims);
  } catch (err) {
    console.error(err);
  }
}

run();
