import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import { hashPassword } from '@/lib/hash';
import { prisma } from '@/lib/prisma';
import type { UserRole } from '@/models/user-model';

interface Config {
  role: UserRole;
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  config?: Config
) {
  const role = config?.role ?? 'MEMBER';

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hashPassword('123456'),
      role,
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@email.com',
    password: '123456',
  });

  const { token }: { token: string } = authResponse.body;

  return {
    token,
  };
}
