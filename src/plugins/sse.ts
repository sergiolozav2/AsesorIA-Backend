import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifySSEPlugin from 'fastify-sse-v2';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySSEPlugin);
});
