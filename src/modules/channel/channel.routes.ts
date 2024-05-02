import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { ChannelService } from './channel.service';
import { RequestGetAllChatSchema } from './channel.schema';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  const channelService = new ChannelService();

  fastify.addHook('preHandler', fastify.authenticate);
  fastify.get('/sessions', { schema: RequestGetAllChatSchema }, async (req) => {
    const chats = await channelService.getAllSessions(req.user.companyID);
    return { list: chats };
  });

  done();
}
