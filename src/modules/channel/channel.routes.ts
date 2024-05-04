import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { ChannelService } from './channel.service';
import {
  RequestDeleteSessionSchema,
  RequestGetAllSessionSchema,
} from './channel.schema';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  const channelService = new ChannelService(fastify.baileys);

  fastify.addHook('preHandler', fastify.authenticate);
  fastify.get(
    '/sessions',
    { schema: RequestGetAllSessionSchema },
    async (req) => {
      const chats = await channelService.getAllSessions(req.user.companyID);
      return { list: chats };
    },
  );

  fastify.delete(
    '/session',
    {
      schema: RequestDeleteSessionSchema,
    },
    async (req) => {
      const deleted = await channelService.deleteSession(req.body.waSessionID);
      return deleted;
    },
  );
  done();
}
