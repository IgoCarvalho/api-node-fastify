import { prisma } from '@/lib/prisma';
import type { CreateGymInput, Gym } from '@/models/gym-model';
import type { Gym as PrismaGym } from '@/prisma/client';
import type { Coordinate } from '@/utils/get-distance-between-coordinates';
import type { GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
  async create(data: CreateGymInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    });

    return {
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    };
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const pageSize = 20;
    const pageStart = (page - 1) * pageSize;

    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: pageSize,
      skip: pageStart,
    });

    return gyms.map((gym) => ({
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }));
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    if (!gym) {
      return null;
    }

    return {
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    };
  }

  async findManyNearby({ latitude, longitude }: Coordinate): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<PrismaGym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms.map((gym) => ({
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }));
  }
}
