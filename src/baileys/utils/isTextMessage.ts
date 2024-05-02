import { proto } from '@whiskeysockets/baileys';

export function isTextMessage(message: proto.IWebMessageInfo) {
  const content = message.message;
  if (content?.conversation) {
    return true;
  }
  if (content?.extendedTextMessage?.text) {
    return true;
  }
  return false;
}
