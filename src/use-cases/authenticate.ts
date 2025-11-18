import { comparePassword } from '@/lib/hash';
import type { User } from '@/models/user-model';
import type { UsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUseCaseResponse = {
  user: User;
};

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const dosPasswordMatches = await comparePassword(password, user.password);

    if (!dosPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
