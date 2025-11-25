import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInUseCase } from '../check-in';

export function makeCheckInUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const checkInRepository = new PrismaCheckInsRepository();
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository);

  return useCase;
}
