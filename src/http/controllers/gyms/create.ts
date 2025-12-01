import type { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().lt(90).gt(-90),
    longitude: z.number().lt(180).gt(-180),
  });

  const { title, description, phone, latitude, longitude } = bodySchema.parse(
    request.body
  );

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  reply.status(StatusCodes.CREATED).send();
}
