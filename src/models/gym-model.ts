export interface Gym {
  id: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

export type CreateGymInput = Omit<Gym, 'id'>;

export interface FindManyNearbyInput {
  latitude: number;
  longitude: number;
}
