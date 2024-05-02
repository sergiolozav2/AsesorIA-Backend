import { Static, Type } from '@sinclair/typebox';

export type InsertWhatsappSessionType = Static<
  typeof InsertWhatsappSessionSchema
>;
export const InsertWhatsappSessionSchema = Type.Object({
  name: Type.String({ maxLength: 256, minLength: 1 }),
  waSessionID: Type.String({ length: 100 }),
  companyID: Type.Number(),
  createdBy: Type.Number(),
});
