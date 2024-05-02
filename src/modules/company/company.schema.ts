import { Static, Type } from '@sinclair/typebox';

export type SelectCompanyType = Static<typeof SelectCompanySchema>;
export const SelectCompanySchema = Type.Object({
  companyID: Type.Integer(),
  name: Type.String(),
  ownerID: Type.Number(),
});

export type InsertCompanyType = Static<typeof InsertCompanySchema>;
export const InsertCompanySchema = Type.Omit(SelectCompanySchema, [
  'companyID',
]);
