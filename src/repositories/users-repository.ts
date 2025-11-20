import type { CreateUserInput, User } from '@/models/user-model';

export interface UsersRepository {
  create(data: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
