import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { InsertMessageType } from './message.schema';

export class MessageRepository extends SharedRepository {
  async createMany(messages: InsertMessageType[]) {
    return await this.db.insert(schema.message).values(messages).returning();
  }
}
