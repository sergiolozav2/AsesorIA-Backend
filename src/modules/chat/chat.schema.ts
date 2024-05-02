import { Static, Type } from '@sinclair/typebox';

export const MessageChatSchema = Type.Object({
  fromMe: Type.Boolean(),
  content: Type.Any(),
  createdAt: Type.String({ format: 'date' }),
});

export const SelectChatSchema = Type.Object({
  chatID: Type.Number(),
  jid: Type.String(),
  pushName: Type.String(),
  messages: Type.Array(MessageChatSchema),
});
export type SelectChatType = Static<typeof SelectChatSchema>;

export const RequestAllChatResponse = Type.Object({
  list: Type.Array(SelectChatSchema),
});

export const AllChatSchema = {
  response: {
    200: RequestAllChatResponse,
  },
};
