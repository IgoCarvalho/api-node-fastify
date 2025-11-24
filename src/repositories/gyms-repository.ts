import type { CreateGymInput, Gym } from '@/models/gym-model';
import type { Coordinate } from '@/utils/get-distance-between-coordinates';

export interface GymsRepository {
  create(data: CreateGymInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(data: Coordinate): Promise<Gym[]>;
  findById(id: string): Promise<Gym | null>;
}
