import { SharedRepository } from '../shared/shared.repository';
import { DbType, schema } from '@api/plugins/db';
import { InsertClientType, UpdateClientType } from './client.schema';
import { eq } from 'drizzle-orm';

export class ClientRepository extends SharedRepository {
  async create(data: InsertClientType, tx?: DbType) {
    tx = tx ?? this.db;
    const client = await tx.insert(schema.client).values(data).returning();
    return client;
  }

  async update(data: UpdateClientType, clientID: number) {
    await this.db
      .update(schema.client)
      .set(data)
      .where(eq(schema.client.clientID, clientID));
  }
}
