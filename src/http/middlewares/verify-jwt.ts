import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Unauthorized' });
  }
}
