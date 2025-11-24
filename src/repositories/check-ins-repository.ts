import type { CheckIn, CreateCheckInInput } from '@/models/check-in-model';

export interface CheckInsRepository {
  create(data: CreateCheckInInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  countByUserId(userId: string): Promise<number>;
  findById(id: string): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
