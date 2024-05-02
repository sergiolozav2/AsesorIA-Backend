import { MessageUpsertType, proto } from '@whiskeysockets/baileys';
import { getMessageContent } from '../utils/getMessageContent';
import { MessageRepository } from '@api/modules/message/message.repository';
import { InsertMessageType } from '@api/modules/message/message.schema';
import { ChannelRepository } from '@api/modules/channel/channel.repository';
import { getMessageData } from '../utils/getMessageData';

type MessagesHandlersParam = {
  messages: proto.IWebMessageInfo[];
  type: MessageUpsertType;
  sessionID: string;
};

function splitSessionIDPath(sessionID: string) {
  const words = sessionID.split('/');
  return words[words.length - 1];
}

/// Almacena los mensajes en la base de datos
export async function messagesHandler({
  messages,
  sessionID,
}: MessagesHandlersParam) {
  const channelRepository = new ChannelRepository();
  const messageRepository = new MessageRepository();

  sessionID = splitSessionIDPath(sessionID);
  const validMessages: InsertMessageType[] = [];

  const placeholderChatID = -1;
  for (const message of messages) {
    if (!message.key.id) {
      continue;
    }
    const { isText, fromMe, timestamp } = getMessageContent(message);
    if (isText) {
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
    let chat = await channelRepository.findByID(jid, sessionID);
    if (!chat) {
      chat = await channelRepository.createChat({
        jid,
        pushName,
        waSessionID: sessionID,
      });
    }
    const saveMessages = validMessages.map((message) => ({
      ...message,
      chatID: chat.chatID,
    }));
    messageRepository.createMany(saveMessages);
  }
}
