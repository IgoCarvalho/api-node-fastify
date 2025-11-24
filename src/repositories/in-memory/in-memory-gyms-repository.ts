import { randomUUID } from 'node:crypto';
import type { CreateGymInput, Gym } from '@/models/gym-model';
import {
  type Coordinate,
  getDistanceBetweenCoordinates,
} from '@/utils/get-distance-between-coordinates';
import type { GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
  readonly data: Gym[] = [];

  create({
    phone,
    title,
    description,
    latitude,
    longitude,
  }: CreateGymInput): Promise<Gym> {
    const gym = {
      id: randomUUID(),
      phone,
      title,
      description,
      latitude,
      longitude,
    };

    this.data.push(gym);

    return Promise.resolve(gym);
  }

  findById(id: string): Promise<Gym | null> {
    const gym = this.data.find((g) => g.id === id);

    return Promise.resolve(gym || null);
  }

  findManyNearby(params: Coordinate): Promise<Gym[]> {
    const nearbyGyms = this.data.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: gym.latitude, longitude: gym.longitude },
        { latitude: params.latitude, longitude: params.longitude }
      );
      const MAX_DISTANCE_IN_KM = 10;

      return distance <= MAX_DISTANCE_IN_KM;
    });

    return Promise.resolve(nearbyGyms);
  }

  searchMany(query: string, page: number): Promise<Gym[]> {
    const pageSize = 20;
    const sliceStart = (page - 1) * pageSize;
    const SliceEnd = page * pageSize;

    const gyms = this.data
      .filter((gym) =>
        gym.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      )
      .slice(sliceStart, SliceEnd);

    return Promise.resolve(gyms);
  }
}
