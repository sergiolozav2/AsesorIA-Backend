import { MessageUpsertType, proto } from '@whiskeysockets/baileys';
import { getMessageJid } from '../utils/getMessageJid';
import { isTextMessage } from '../utils/isTextMessage';
import { getMessageTimestamp } from '../utils/getMessageTimestamp';
import { MessageRepository } from '@api/modules/message/message.repository';
import { InsertMessageType } from '@api/modules/message/message.schema';
import { ChannelRepository } from '@api/modules/channel/channel.repository';

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
  const jid = getMessageJid(messages);

  let chat = await channelRepository.findByID(jid, sessionID);
  if (!chat) {
    chat = await channelRepository.createChat({
      jid,
      waSessionID: sessionID,
    });
  }
  for (const message of messages) {
    if (!message.key.id) {
      continue;
    }
    const isText = isTextMessage(message);
    if (isText) {
      console.log(`Guardando mensaje de: ${jid}`);
      const creadoEn = getMessageTimestamp(message);
      validMessages.push({
        createdAt: creadoEn.getTime().toString(),
        content: JSON.stringify(message.message),
        waID: message.key.id,
        chatID: chat.chatID,
      });
    }
  }

  messageRepository.createMany(validMessages);
}
