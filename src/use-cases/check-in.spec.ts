import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: CheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.data.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.501_421_1,
      longitude: -46.633_308_9,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.501_421_1,
      userLongitude: -46.633_308_9,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 10, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.501_421_1,
      userLongitude: -46.633_308_9,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.501_421_1,
        userLongitude: -46.633_308_9,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check-in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 10, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.501_421_1,
      userLongitude: -46.633_308_9,
    });

    vi.setSystemTime(new Date(2025, 10, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.501_421_1,
      userLongitude: -46.633_308_9,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check-in on distant gym', async () => {
    vi.setSystemTime(new Date(2025, 10, 20, 8, 0, 0));

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -24.501_421_1,
        userLongitude: -46.633_308_9,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
