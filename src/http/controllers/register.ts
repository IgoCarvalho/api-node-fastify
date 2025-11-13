import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { registerUseCase } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bdySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = bdySchema.parse(request.body);

  try {
    await registerUseCase({ email, name, password });
  } catch (error) {
    console.error(error);

    return reply.status(409).send({ message: 'User already exists' });
  }

  reply.status(201).send();
}
