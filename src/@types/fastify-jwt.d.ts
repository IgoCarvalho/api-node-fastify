import type { UserRole } from '@/models/user-model';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: UserRole;
      sub: string;
    };
  }
}
