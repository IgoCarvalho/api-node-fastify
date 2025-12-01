import { fastifyJwt } from '@fastify/jwt';
import { fastify } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ZodError, z } from 'zod';
import { env } from './env';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { usersRoutes } from './http/controllers/users/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(gymsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Validation error', issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    // biome-ignore lint/suspicious/noConsole: Show error in development
    console.error(error);
  }

  return reply
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: 'Internal server error' });
});
