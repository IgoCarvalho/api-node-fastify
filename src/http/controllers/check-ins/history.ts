import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = querySchema.parse(request.query);

  const fetchCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(StatusCodes.OK).send({ checkIns });
}
