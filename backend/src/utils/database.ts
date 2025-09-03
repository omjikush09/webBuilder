import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "../generated/prisma/types";

// Database configuration using DATABASE_URL
const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
});

// Create Kysely instance
export const db = new Kysely<DB>({
	dialect,
});

// Export types
export type Database = DB;
