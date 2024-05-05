import { proto } from '@whiskeysockets/baileys';

export function isMessageFromGroup(message: proto.IWebMessageInfo) {
  return !!message.key.participant;
}
