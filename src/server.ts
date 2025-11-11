import 'dotenv/config';
import { app } from './app.ts';
import { env } from './env.ts';

app.get('/', (_request, reply) => {
  reply.send({ hello: 'world' });
});

app
  .listen({ host: '0.0.0.0', port: env.PORT })
  .then((address) => {
    console.log(`🚀 Server running at ${address} `);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
