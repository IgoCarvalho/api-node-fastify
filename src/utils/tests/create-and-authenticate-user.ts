import type { FastifyInstance } from 'fastify';
import request from 'supertest';
import type { User } from '@/models/user-model';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const createUserResponse = await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: '123456',
  });

  const { user }: { user: User } = createUserResponse.body;

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@email.com',
    password: '123456',
  });

  const { token }: { token: string } = authResponse.body;

  return {
    token,
    user,
  };
}
