import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    latitude: z.number().lt(90).gt(-90),
    longitude: z.number().lt(180).gt(-180),
  });

  const paramsSchema = z.object({
    gymId: z.uuid(),
  });

  const { latitude, longitude } = bodySchema.parse(request.body);

  const { gymId } = paramsSchema.parse(request.params);

  try {
    const checkInUseCase = makeCheckInUseCase();

    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply
        .status(StatusCodes.NOT_FOUND)
        .send({ message: error.message });
    }

    if (
      error instanceof MaxNumberOfCheckInsError ||
      error instanceof MaxDistanceError
    ) {
      return reply
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: error.message });
    }

    throw error;
  }

  reply.status(StatusCodes.CREATED).send();
}
