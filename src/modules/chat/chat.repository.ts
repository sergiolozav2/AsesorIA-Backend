import { SharedRepository } from '../shared/shared.repository';
import { schema } from '@api/plugins/db';
import { eq } from 'drizzle-orm';

export class ChatRepository extends SharedRepository {
  async findByCompanyID(companyID: number) {
    const sessionsAndChats = await this.db.query.waSession.findMany({
      columns: {
        createdAt: true,
        name: true,
        waSessionID: true,
      },
      where: eq(schema.waSession.companyID, companyID),
      with: {
        chats: {
          columns: {
            chatID: true,
            jid: true,
            pushName: true,
            createdAt: true,
          },
          with: {
            messages: {
              columns: {
                fromMe: true,
                content: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    const [onlyChats] = sessionsAndChats.map((chat) => chat.chats);
    return onlyChats;
  }
}
