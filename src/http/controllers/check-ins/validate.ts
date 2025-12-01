import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = paramsSchema.parse(request.params);

  try {
    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
      checkInId,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply
        .status(StatusCodes.NOT_FOUND)
        .send({ message: error.message });
    }

    if (error instanceof LateCheckInValidationError) {
      return reply
        .status(StatusCodes.BAD_REQUEST)
        .send({ message: error.message });
    }

    throw error;
  }

  reply.status(StatusCodes.NO_CONTENT).send();
}
