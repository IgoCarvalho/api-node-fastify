export interface CreateCheckInInput {
  gymId: string;
  userId: string;
}

export interface CheckIn {
  id: string;
  createdAt: Date;
  validatedAt: Date | null;
  gymId: string;
  userId: string;
}
