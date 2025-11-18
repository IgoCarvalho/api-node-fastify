import { describe, expect, it } from 'vitest';
import { comparePassword } from '@/lib/hash';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

describe('Register use case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const rawPassword = '123456';

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const rawPassword = '123456';
    const email = 'johndoe@email.com';

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: rawPassword,
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: rawPassword,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
