import { Static, Type } from '@sinclair/typebox';

export type InsertMessageType = Static<typeof InsertMessageSchema>;
export const InsertMessageSchema = Type.Object({
  content: Type.String(),
  waID: Type.String(),
  chatID: Type.Number(),
  createdAt: Type.Optional(Type.String()),
  fromMe: Type.Boolean(),
});
