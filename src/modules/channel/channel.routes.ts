import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { ChannelService } from './channel.service';
import {
  RequestGetAllSessionSchema,
  RequestResetSessionSchema,
} from './channel.schema';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  const channelService = new ChannelService();

  fastify.addHook('preHandler', fastify.authenticate);
  fastify.get(
    '/sessions',
    { schema: RequestGetAllSessionSchema },
    async (req) => {
      const chats = await channelService.getAllSessions(req.user.companyID);
      return { list: chats };
    },
  );

  fastify.post(
    '/reset-session',
    { schema: RequestResetSessionSchema },
    async (req) => {
      await fastify.baileys.resetWhatsappSession(req.body.waSessionID);
      return { message: 'ok' };
    },
  );

  done();
}
