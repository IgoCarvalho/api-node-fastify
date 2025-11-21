import { beforeEach, describe, expect, it } from 'vitest';
import type { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymRepository: GymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      latitude: -23.501_421_1,
      longitude: -46.633_308_9,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
