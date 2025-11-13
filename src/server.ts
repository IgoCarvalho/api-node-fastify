import 'dotenv/config';
import { app } from '@/app';
import { env } from '@/env';

app
  .listen({ host: '0.0.0.0', port: env.PORT })
  .then((address) => {
    console.log(`🚀 Server running at: ${address} `);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
