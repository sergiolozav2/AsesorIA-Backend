import { DrizzleError, eq } from 'drizzle-orm';
import { InsertUserType } from './user.schema';
import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { InsertCompanyType } from '../company/company.schema';

export class UserRepository extends SharedRepository {
  async findByEmail(email: string) {
    const [userAndCompany] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .leftJoin(schema.company, eq(schema.user.userID, schema.company.ownerID))
      .limit(1);

    return userAndCompany;
  }

  async createUserAndCompany(
    userData: InsertUserType,
    companyData: InsertCompanyType,
  ) {
    try {
      const result = this.db.transaction(async (tx) => {
        const [user] = await tx
          .insert(schema.user)
          .values({
            ...userData,
            verified: false,
          })
          .returning();
        user.password = '';

        const [company] = await tx
          .insert(schema.company)
          .values({ ...companyData, ownerID: user.userID })
          .returning();
        return { user, company };
      });
      return result;
    } catch (error) {
      if (error instanceof DrizzleError) {
        throw new Error(error.message ?? error?.toString());
      }
      throw new Error(`${error}`);
    }
  }
}
