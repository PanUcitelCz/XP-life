import { config } from 'dotenv'; // Import the config function from the dotenv package to load environment variables
import { drizzle } from 'drizzle-orm/libsql'; // Import the drizzle function from the drizzle-orm library for SQL databases
import { createClient } from '@libsql/client'; // Import the createClient function from the @libsql/client package

config(); // Load environment variables from the .env file

// Create a client for the database connection using the URL and token from environment variables
const client = createClient({
  url: process.env.DB_URL!, // Database URL from environment variables
  authToken: process.env.DB_TOKEN!, // Authentication token from environment variables
});

// Export the database connection using the drizzle function
export const db = drizzle(client);


/*
  Terminal: npm install drizzle-orm @libsql/client dotenv - install drizzle to project
            npm install -D drizzle-kit

            Create .env - DB_URL, DB_TOKEN

            npx drizzle-kit generate - Create migrations documentions jason
            npx drizzle-kit push - Pushed schema.ts to db

            alt + shift + a = coment celý blok

*/