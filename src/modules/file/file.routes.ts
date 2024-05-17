import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { FileService } from './file.service';
import { RequestStoreImageSchema } from './file.schema';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  fastify.addHook('preHandler', fastify.authenticate);
  const fileService = new FileService();

  fastify.post(
    '/image',
    {
      schema: RequestStoreImageSchema,
    },
    async (req) => {
      const fileUrl = await fileService.storeImageFromURL(req.body.url);
      return { fileUrl };
    },
  );

  done();
}
