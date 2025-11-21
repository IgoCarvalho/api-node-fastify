import type { CreateGymInput, Gym } from '@/models/gym-model';

export interface GymsRepository {
  create(data: CreateGymInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
}
