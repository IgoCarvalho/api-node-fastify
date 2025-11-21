import type { Gym } from '@/models/gym-model';
import type { GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  readonly data: Gym[] = [];

  findById(id: string): Promise<Gym | null> {
    const gym = this.data.find((g) => g.id === id);

    return Promise.resolve(gym || null);
  }
}
