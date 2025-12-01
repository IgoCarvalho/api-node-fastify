export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type UserRole = 'ADMIN' | 'MEMBER';
export interface User {
  name: string;
  id: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: Date;
}
