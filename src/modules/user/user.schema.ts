import { Static, Type } from '@sinclair/typebox';

export type SelectUserType = Static<typeof InsertUserSchema>;
export const SelectUserSchema = Type.Object({
  userID: Type.Number(),
  fullName: Type.String(),
  password: Type.String(),
  email: Type.String({ format: 'email' }),
  verified: Type.Boolean(),
});

export type InsertUserType = Static<typeof InsertUserSchema>;
export const InsertUserSchema = Type.Omit(SelectUserSchema, ['userID']);
