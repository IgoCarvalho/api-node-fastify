import { beforeEach, describe, expect, it } from 'vitest';
import { hashPassword } from '@/lib/hash';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: await hashPassword('123456'),
    });

    const { user } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: await hashPassword('123456'),
    });

    await expect(
      sut.execute({
        email: 'johndoe@email.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
