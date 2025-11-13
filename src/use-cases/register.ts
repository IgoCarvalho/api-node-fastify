import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';

type RegisterUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export async function registerUseCase({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const hashSalt = 6;

  const passwordHash = await bcrypt.hash(password, hashSalt);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('User already exists');
  }

  const prismaUsersRepository = new PrismaUsersRepository();
  await prismaUsersRepository.create({
    name,
    email,
    password: passwordHash,
  });
}
