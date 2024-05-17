import { proto } from '@whiskeysockets/baileys';
import { SelectChatAndClientType } from './baileys.schema';

export class BaileysHelper {
  getMapJidToChatID(results: SelectChatAndClientType[]) {
    const map: { [key: string]: number } = {};
    for (const result of results) {
      const chatID = result.chat.chatID;
      const jid = result.chat.jid;
      map[jid] = chatID;
    }
    return map;
  }

  getMessageContent(message: proto.IWebMessageInfo) {
    const jid = message.key.remoteJid;
    const timestamp = this.getMessageTimestamp(message);
    const isText = this.isTextMessage(message);
    const fromMe = this.isFromMe(message);
    const fromGroup = this.isMessageFromGroup(message);
    const pushName = this.getMessagePushName(message);
    return { timestamp, isText, fromMe, fromGroup, pushName, jid };
  }

  private getMessagePushName(message: proto.IWebMessageInfo) {
    return message?.pushName ?? message.key.remoteJid?.split('@')[0] ?? '';
  }

  private getMessageTimestamp(message: proto.IWebMessageInfo) {
    const timestamp = message?.messageTimestamp;
    if (timestamp) {
      return new Date(Number(timestamp) * 1000);
    }
    return new Date();
  }

  private isTextMessage(message: proto.IWebMessageInfo) {
    const content = message.message;
    if (content?.conversation) {
      return true;
    }
    if (content?.extendedTextMessage?.text) {
      return true;
    }
    return false;
  }

  private isFromMe(message: proto.IWebMessageInfo) {
    return message.key.fromMe;
  }

  private isMessageFromGroup(message: proto.IWebMessageInfo) {
    return !!message.key.participant;
  }
}
