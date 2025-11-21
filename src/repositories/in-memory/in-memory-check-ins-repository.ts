import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';
import type { CheckIn, CreateCheckInInput } from '@/models/check-in-model';
import type { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly data: CheckIn[] = [];

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkInOnSameDate = this.data.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt);
      const isOnSameDate = dayjs(date).isSame(checkInDate, 'date');
      return checkIn.userId === userId && isOnSameDate;
    });

    return Promise.resolve(checkInOnSameDate || null);
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const pageSize = 20;
    const sliceStart = (page - 1) * pageSize;
    const SliceEnd = page * pageSize;

    const checkIns = this.data
      .filter((checkIn) => checkIn.userId === userId)
      .slice(sliceStart, SliceEnd);

    return Promise.resolve(checkIns);
  }

  create({ gymId, userId }: CreateCheckInInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      createdAt: new Date(),
      validatedAt: null,
      gymId,
      userId,
    };

    this.data.push(checkIn);

    return Promise.resolve(checkIn);
  }
}
