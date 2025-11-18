import { hashPassword } from '@/lib/hash';
import type { User } from '@/models/user-model';
import type { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await hashPassword(password);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return {
      user,
    };
  }
}
