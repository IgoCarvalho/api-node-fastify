import type { Gym } from '@/models/gym-model';

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
}
