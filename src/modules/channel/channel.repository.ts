import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { eq } from 'drizzle-orm';

export class ChannelRepository extends SharedRepository {
  async getCompanySessions(companyID: number) {
    const waSessions = await this.db
      .select()
      .from(schema.waSession)
      .where(eq(schema.waSession.companyID, companyID));
    return waSessions;
  }

  async deleteSession(waSessionID: string) {
    const [deleted] = await this.db
      .delete(schema.waSession)
      .where(eq(schema.waSession.waSessionID, waSessionID))
      .returning({
        waSessionID: schema.waSession.waSessionID,
      });
    return deleted;
  }
}
