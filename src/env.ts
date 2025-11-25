import { z } from 'zod';

const defaultPort = 3333;

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(defaultPort),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
