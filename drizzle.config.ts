import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";


export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}); 