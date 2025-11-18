import { describe, expect, it } from 'vitest';
import { hashPassword } from '@/lib/hash';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(
      sut.execute({
        email: 'johndoe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

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
