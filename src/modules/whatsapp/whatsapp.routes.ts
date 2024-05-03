import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { WhatsappService } from './whatsapp.service';
import { WhatsappEventEmitter } from '@api/baileys/whatsappEvents';

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
      const eventEmitter = WhatsappEventEmitter();
      eventEmitter.on('*', function (data) {
        const event = this?.event;
        res.sse({ data: formatSSE(event, data) });
      });
      eventEmitter.on('error', () => {
        res.sseContext.source.end();
      });
      whatsappService.createSession(req.user, eventEmitter, fastify.baileys);
      req.raw.on('close', () => {
        console.log('Event closed');
      });
    },
  );

  done();
}
