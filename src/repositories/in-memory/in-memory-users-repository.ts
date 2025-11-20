import { randomUUID } from 'node:crypto';
import type { CreateUserInput, User } from '@/models/user-model';
import type { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly data: User[] = [];

  create(data: CreateUserInput): Promise<User> {
    const newUser = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };

    this.data.push(newUser);

    return Promise.resolve(newUser);
  }

  findById(id: string): Promise<User | null> {
    const user = this.data.find((u) => u.id === id);

    return Promise.resolve(user || null);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.data.find((u) => u.email === email);

    return Promise.resolve(user || null);
  }
}
