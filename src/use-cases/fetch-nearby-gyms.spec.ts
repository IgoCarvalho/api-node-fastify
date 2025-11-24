import { beforeEach, describe, expect, it } from 'vitest';
import type { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: GymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -23.504_421_1,
      longitude: -46.636_308_9,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -23.401_421_1,
      longitude: -46.733_308_9,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.501_421_1,
      userLongitude: -46.633_308_9,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
