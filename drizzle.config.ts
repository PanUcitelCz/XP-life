import type { Config } from 'drizzle-kit';
import 'dotenv/config';

/** @type { import("drizzle-kit").Config } */
export default {
	schema: './src/lib/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: process.env.DB_URL!,
		authToken: process.env.DB_TOKEN
	}
} satisfies Config;
