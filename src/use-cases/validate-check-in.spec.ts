import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

let checkInsRepository: CheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate a check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    const validatedCheckIn = await checkInsRepository.findById(
      createdCheckIn.id
    );

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(validatedCheckIn?.validatedAt).toEqual(expect.any(Date));
  });

  it('should not be able to validate an invalid check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'invalid-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 10, 1, 10, 10, 0));

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
