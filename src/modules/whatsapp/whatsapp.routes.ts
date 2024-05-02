import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { WhatsappService } from './whatsapp.service';

function formatSSE(event: string, data: unknown) {
  return JSON.stringify({ event, data });
}

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  fastify.addHook('preHandler', fastify.authenticate);
  const whatsappService = new WhatsappService();

  fastify.get(
    '/test',
    {
      schema: {},
    },
    async (req) => {
      return req.user;
    },
  );
  fastify.get(
    '/create-session',
    {
      preHandler: [fastify.authenticate],
      schema: {},
    },
    async (req, res) => {
      res.sse({ data: formatSSE('start', '') });
      whatsappService.createSession(req.user, {
        onLoadedQR(qr) {
          res.sse({ data: formatSSE('qr', qr) });
        },
        onScannedQR() {
          res.sse({ data: formatSSE('scanned', 'success') });
          res.sseContext.source.end();
        },
        onError(message) {
          res.sse({ data: formatSSE('error', message.toString()) });
          res.sseContext.source.end();
        },
      });
      req.raw.on('close', () => {});
    },
  );

  done();
}
