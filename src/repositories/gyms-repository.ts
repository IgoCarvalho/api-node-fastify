import type { CreateGymInput, Gym } from '@/models/gym-model';

export interface GymsRepository {
  create(data: CreateGymInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findById(id: string): Promise<Gym | null>;
}
