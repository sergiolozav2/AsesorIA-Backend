import {
  InsertChatType,
  InsertMessageType,
  SelectChatType,
} from '@api/modules/whatsapp/baileys.schema';
import { getMessageContent } from '../utils/getMessageContent';
import { getMessageData } from '../utils/getMessageData';
import { MessageUpsertType, proto } from '@whiskeysockets/baileys';

interface MessageHandlerFunctions {
  findChatByID: (jid: string, sessionID: string) => Promise<SelectChatType>;
  createChat: (data: InsertChatType) => Promise<SelectChatType>;
  createManyMessages: (messages: InsertMessageType[]) => Promise<void>;
}

export type MessagesHandlerParam = {
  messages: proto.IWebMessageInfo[];
  type: MessageUpsertType;
  sessionID: string;
  companyID: number;
};
export type MessageHandlerType = ReturnType<typeof baseMessageHandler>;

export function baseMessageHandler(functions: MessageHandlerFunctions) {
  async function messageHandler({
    messages,
    companyID,
    sessionID,
  }: MessagesHandlerParam) {
    const validMessages: InsertMessageType[] = [];

    const placeholderChatID = -1;
    for (const message of messages) {
      if (!message.key.id) {
        continue;
      }
      const { isText, fromMe, timestamp } = getMessageContent(message);
      const fromGroup = isMessageFromGroup(message);
      if (isText && !fromGroup) {
        validMessages.push({
          fromMe,
          createdAt: timestamp.toISOString(),
          content: JSON.stringify(message.message),
          waID: message.key.id,
          chatID: placeholderChatID,
        });
      }
    }

    const { jid, pushName } = getMessageData(messages);
    if (validMessages.length >= 1 && jid) {
      let chat = await functions.findChatByID(jid, sessionID);
      if (!chat) {
        chat = await functions.createChat({
          jid,
          pushName,
          companyID,
          waSessionID: sessionID,
        });
      }
      const saveMessages = validMessages.map((message) => ({
        ...message,
        chatID: chat.chatID,
      }));
      functions.createManyMessages(saveMessages);
    }
  }

  return messageHandler;
}
