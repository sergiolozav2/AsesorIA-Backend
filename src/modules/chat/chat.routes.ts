import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { ChatService } from './chat.service';
import { AllChatSchema } from './chat.schema';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  fastify.addHook('preHandler', fastify.authenticate);
  const chatService = new ChatService();

  fastify.post(
    '/all',
    {
      schema: AllChatSchema,
    },
    async (req) => {
      const chats = await chatService.allChats(req.user.companyID);
      return { list: chats };
    },
  );

  done();
}
