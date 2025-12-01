import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUSerMetrics = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUSerMetrics.execute({
    userId: request.user.sub,
  });

  return reply.status(StatusCodes.OK).send({ checkInsCount });
}
