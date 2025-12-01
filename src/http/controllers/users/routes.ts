import type { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { prisma } from '@/lib/prisma';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { refresh } from './refresh';
import { register } from './register';

// biome-ignore lint/suspicious/useAwait: Fastify plugins need to be async
export async function usersRoutes(app: FastifyInstance) {
  app.get('/users', async (_request, reply) => {
    const users = await prisma.user.findMany();
    reply.send({ users });
  });

  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
