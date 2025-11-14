export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface User {
  name: string;
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}
