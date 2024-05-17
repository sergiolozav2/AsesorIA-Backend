import { SharedRepository } from '../shared/shared.repository';
import { schema } from '@api/plugins/db';
import { eq } from 'drizzle-orm';

export class ChatRepository extends SharedRepository {
  async findByCompanyID(companyID: number) {
    const chats = await this.db.query.chat.findMany({
      columns: {
        chatID: true,
        jid: true,
        createdAt: true,
      },
      with: {
        client: {
          columns: {
            clientID: true,
            firstName: true,
            phone: true,
            profilePicture: true,
          },
        },
        messages: {
          columns: {
            fromMe: true,
            content: true,
            createdAt: true,
          },
        },
      },
      where: eq(schema.chat.companyID, companyID),
    });
    return chats;
  }
}
