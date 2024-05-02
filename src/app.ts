/* eslint-disable @typescript-eslint/no-explicit-any */

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyCors from '@fastify/cors';
import autoload from '@fastify/autoload';
import fastify from 'fastify';
import path from 'path';

export async function buildApp() {
  const app = fastify({
    logger: false,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(fastifyCors, {
    origin: [
      'http://localhost:5173',
      'http://localhost:5000',
      'https://asesoria-frontend.netlify.app',
    ],
    credentials: true,
  });

  await app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
  });

  app.register(autoload, {
    dir: path.join(__dirname, 'modules'),
    options: { prefix: '/api' },
    matchFilter: (path) => path.includes('routes'),
  });

  return app;
}
