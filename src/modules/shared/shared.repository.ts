import { DbType, db } from '@api/plugins/db';

export class SharedRepository {
  constructor(dbParam?: DbType) {
    if (!db && !dbParam) {
      throw new Error(
        "Global 'db' instance hasn't been initialized and 'dbParam' not found.",
      );
    }
    this.db = dbParam ?? db;
  }
  protected db: DbType;
}
