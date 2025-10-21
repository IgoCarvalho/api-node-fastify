import { z } from 'zod';

const defaultPort = 3333;

const envSchema = z.object({
  PORT: z.coerce.number().default(defaultPort),
});

export const env = envSchema.parse(process.env);
