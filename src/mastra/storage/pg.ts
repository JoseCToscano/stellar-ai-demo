import { PostgresStore, PgVector } from "@mastra/pg";
import { env } from "../../env";

export const pgdb = new PostgresStore({
  connectionString: env.DATABASE_URL,
});

export const pgdbVector = new PgVector({
  connectionString: env.DATABASE_URL,
});
