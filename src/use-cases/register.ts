import bcrypt from 'bcryptjs';
import type { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const hashSalt = 6;

    const passwordHash = await bcrypt.hash(password, hashSalt);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });
  }
}
