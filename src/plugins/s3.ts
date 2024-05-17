import { S3Client } from '@aws-sdk/client-s3';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    s3: S3Client;
  }
}

export let s3Client: S3Client;
async function plugin(fastify: FastifyInstance) {
  const s3 = new S3Client({
    forcePathStyle: true,
    credentials: {
      accessKeyId: fastify.config.S3_ACCESS_KEY,
      secretAccessKey: fastify.config.S3_SECRET_ID,
    },
    endpoint: fastify.config.S3_ENDPOINT,
    region: fastify.config.S3_REGION,
  });
  fastify.s3 = s3;
  s3Client = s3;
}

export default fastifyPlugin(plugin, {
  name: 's3',
  dependencies: ['config'],
});
