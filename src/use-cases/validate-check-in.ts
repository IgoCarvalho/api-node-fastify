import dayjs from 'dayjs';
import type { CheckIn } from '@/models/check-in-model';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      dayjs(checkIn.createdAt),
      'minutes'
    );

    const MAX_DISTANCE_IN_MINUTES = 20;

    if (distanceInMinutesFromCheckInCreation > MAX_DISTANCE_IN_MINUTES) {
      throw new LateCheckInValidationError();
    }

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
