import { randomUUID } from 'node:crypto';
import type { CreateGymInput, Gym } from '@/models/gym-model';
import type { GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  readonly data: Gym[] = [];

  create({
    phone,
    title,
    description,
    latitude,
    longitude,
  }: CreateGymInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      phone,
      title,
      description,
      latitude,
      longitude,
    };

    this.data.push(gym);

    return Promise.resolve(gym);
  }

  findById(id: string): Promise<Gym | null> {
    const gym = this.data.find((g) => g.id === id);

    return Promise.resolve(gym || null);
  }
}
