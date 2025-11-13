import type { FastifyInstance } from 'fastify';
import { register } from '@/http/controllers/register';
import { prisma } from '@/lib/prisma';

// biome-ignore lint/suspicious/useAwait: Fastify plugins need to be async
export async function appRoutes(app: FastifyInstance) {
  app.get('/users', async (_request, reply) => {
    const users = await prisma.user.findMany();
    reply.send({ users });
  });

  app.post('/users', register);
}
