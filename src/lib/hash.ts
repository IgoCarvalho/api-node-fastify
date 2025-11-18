import bcrypt from 'bcryptjs';

export async function hashPassword(password: string, hashSalt = 6) {
  const hashedPassword = await bcrypt.hash(password, hashSalt);

  return hashedPassword;
}

export async function comparePassword(
  rawPassword: string,
  hashedPassword: string
) {
  const passwordMatches = await bcrypt.compare(rawPassword, hashedPassword);

  return passwordMatches;
}
