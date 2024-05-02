import { Static, Type } from '@sinclair/typebox';

export type InsertChatType = Static<typeof InsertChatSchema>;
export const InsertChatSchema = Type.Object({
  waSessionID: Type.String(),
  pushName: Type.String(),
  jid: Type.String(),
});

export const RequestGetAllSessionResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      waSessionID: Type.String(),
      name: Type.String(),
      createdAt: Type.String({ format: 'date' }),
    }),
  ),
});
export const RequestGetAllSessionSchema = {
  response: {
    200: RequestGetAllSessionResponse,
  },
};

export const RequestResetSession = Type.Object({
  waSessionID: Type.String(),
});
export const RequestResetSessionSchema = {
  body: RequestResetSession,
};
