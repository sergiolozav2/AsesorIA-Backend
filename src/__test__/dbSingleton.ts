import { startDatabase } from '@api/db/startDatabase';
import { DbType } from '@api/plugins/db';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

type DbTestParts = {
  db: DbType;
  container: StartedPostgreSqlContainer;
};

export class DbTest {
  private static instance: DbTestParts;

  private constructor() {}

  private static async initDb() {
    const container = await new PostgreSqlContainer().start();
    const { db } = await startDatabase(container.getConnectionUri());

    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    })
      .then(() => {
        console.log('INIT', 'Migrated test database');
      })
      .catch((error) => {
        console.log('INIT', `Failed to migrate database ${String(error)}`);
        throw new Error(`Failed to migrate database ${String(error)}`);
      });
    return { db, container };
  }

  public static async getInstance(): Promise<DbTestParts> {
    if (!DbTest.instance) {
      const { db, container } = await this.initDb();
      this.instance = { db, container };
    }

    return DbTest.instance;
  }
}
