import { Pool } from "pg";

const user =
  process.env.POSTGRES_USER ?? process.env.DB_USER ?? process.env.USER;
const host = process.env.POSTGRES_HOST ?? process.env.DB_HOST ?? "localhost";
const database =
  process.env.POSTGRES_DATABASE ??
  process.env.DB_NAME ??
  process.env.PGDATABASE;
const password =
  process.env.POSTGRES_PASSWORD ??
  process.env.DB_PASSWORD ??
  process.env.PGPASSWORD;
const port = parseInt(
  process.env.POSTGRES_PORT ??
    process.env.DB_PORT ??
    process.env.PGPORT ??
    "5000",
  10
);

const pool = new Pool({
  user,
  host,
  database,
  password: password ?? undefined,
  port,
});

export default pool;
