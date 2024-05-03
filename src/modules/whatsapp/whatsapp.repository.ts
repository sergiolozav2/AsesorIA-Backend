import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { eq } from 'drizzle-orm';
import { InsertWhatsappSessionType } from './whatsapp.schema';

export class WhatsappRepository extends SharedRepository {
  async findByCompanyID(companyID: number) {
    const [whatsapp] = await this.db
      .select()
      .from(schema.waSession)
      .where(eq(schema.waSession.companyID, companyID));

    return whatsapp;
  }

  async createChat(data: InsertWhatsappSessionType) {
    const [chat] = await this.db
      .insert(schema.waSession)
      .values(data)
      .returning();
    return chat;
  }
}
