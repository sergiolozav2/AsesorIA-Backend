import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

async function plugin(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, swaggerOptions);
  await fastify.register(fastifySwaggerUI, swaggerUIOptions);
}

export default fastifyPlugin(plugin);

const swaggerOptions = {
  swagger: {
    info: {
      title: 'MajoCRM',
      version: '0.0.1',
    },
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform({ schema, url }: any) {
    if (!schema) {
      console.log('Ruta sin esquema, cuidado: ' + url);
      return { schema, url };
    }
    const segments = url.split('/');
    const module = segments[2];
    schema.tags = [module];
    return { schema: schema, url: url };
  },
};

const swaggerUIOptions = {
  routePrefix: '/docs',
};
