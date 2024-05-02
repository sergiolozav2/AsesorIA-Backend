import { proto } from '@whiskeysockets/baileys';

export function getMessageTimestamp(message: proto.IWebMessageInfo) {
  const timestamp = message?.messageTimestamp;
  if (timestamp) {
    return new Date(Number(timestamp) * 1000);
  }
  return new Date();
}
