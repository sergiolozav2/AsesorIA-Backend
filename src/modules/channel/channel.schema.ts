import { Static, Type } from '@sinclair/typebox';

export type InsertChatType = Static<typeof InsertChatSchema>;
export const InsertChatSchema = Type.Object({
  waSessionID: Type.String(),
  jid: Type.String(),
});

export const RequestGetAllChatResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      waSessionID: Type.String(),
      name: Type.String(),
      createdAt: Type.String({ format: 'date' }),
    }),
  ),
});
export const RequestGetAllChatSchema = {
  response: {
    200: RequestGetAllChatResponse,
  },
};
