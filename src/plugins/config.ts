import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import fastifyPlugin from 'fastify-plugin';
import dotenv from 'dotenv';
import fastifyEnv from '@fastify/env';

dotenv.config();

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof envSchema>;
  }
}

const envSchema = Type.Object({
  DATABASE_URL: Type.String(),
  SECRET_JWT: Type.String(),
  SECRET_COOKIE: Type.String(),
  JWT_DURATION_HOURS: Type.Number(),
});

function plugin(fastify: FastifyInstance, _: unknown, done: () => void) {
  const configOptions = {
    confKey: 'config',
    schema: envSchema,
    data: process.env,
  };
  fastifyEnv(fastify, configOptions, done);
}

export default fastifyPlugin(plugin, {
  name: 'config',
});
