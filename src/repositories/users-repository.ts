import type { CreateUserInput, User } from '@/models/user-model';

export interface UsersRepository {
  create(data: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
