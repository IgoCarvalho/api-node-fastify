import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import type { UserRole } from '@/models/user-model';

export function verifyUserRole(roleToVerify: UserRole) {
  // biome-ignore lint/suspicious/useAwait: fastify plugins need to be async
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      return reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: 'Unauthorized.' });
    }
  };
}
