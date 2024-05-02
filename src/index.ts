import { buildApp } from './app';

async function start() {
  const app = await buildApp();
  app.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start();
