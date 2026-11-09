import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const defaultAiHost = process.env.AI_SERVICE_HOST ?? '127.0.0.1';
const defaultAiPort = process.env.AI_SERVICE_PORT ?? '8000';
const defaultAiUrl = `http://${defaultAiHost}:${defaultAiPort}`;

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  AI_SERVICE_HOST: z.string().default(defaultAiHost),
  AI_SERVICE_PORT: z.coerce.number().default(Number(defaultAiPort)),
  AI_SERVICE_API_KEY: z.string(),
  AI_SERVICE_URL: z.string().default(defaultAiUrl),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  NODE_ENV: z.string().default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);