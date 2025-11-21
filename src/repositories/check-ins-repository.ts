import type { CheckIn, CreateCheckInInput } from '@/models/check-in-model';

export interface CheckInsRepository {
  create(data: CreateCheckInInput): Promise<CheckIn>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
