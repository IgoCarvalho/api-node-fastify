import { beforeEach, describe, expect, it } from 'vitest';
import { comparePassword } from '@/lib/hash';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const rawPassword = '123456';

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: rawPassword,
    });

    const isPasswordCorrectlyHashed = await comparePassword(
      rawPassword,
      user.password
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const rawPassword = '123456';
    const email = 'johndoe@email.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: rawPassword,
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: rawPassword,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
