import Fastify from 'fastify';
import 'dotenv/config';
import { env } from './env.ts';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', (_request, reply) => {
  reply.send({ hello: 'world' });
});

fastify.listen({ port: env.PORT }, (err, address) => {
  console.log(`Server running at ${address} 🚀`);

  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
