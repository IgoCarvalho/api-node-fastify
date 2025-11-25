import dayjs from 'dayjs';
import { prisma } from '@/lib/prisma';
import type { CheckIn, CreateCheckInInput } from '@/models/check-in-model';
import type { CheckInsRepository } from '../check-ins-repository';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CreateCheckInInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data });

    return checkIn;
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        userId,
      },
    });

    return count;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const pageSize = 20;
    const pageStart = (page - 1) * pageSize;

    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
      },
      take: pageSize,
      skip: pageStart,
    });

    return checkIns;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIns;
  }
}
