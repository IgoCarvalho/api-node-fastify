import { fastify } from 'fastify';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const app = fastify();

app.get('/users', async (_request, reply) => {
  const users = await prisma.user.findMany();
  reply.send({ users });
});

app.post('/users', async (request, reply) => {
  const bdySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = bdySchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  reply.status(201).send();
});
