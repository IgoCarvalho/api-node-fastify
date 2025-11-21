import { beforeEach, describe, expect, it } from 'vitest';
import type { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.501_421_1,
      longitude: -46.633_308_9,
    });

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: -23.501_421_1,
      longitude: -46.633_308_9,
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ]);
  });

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -23.501_421_1,
        longitude: -46.633_308_9,
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});
