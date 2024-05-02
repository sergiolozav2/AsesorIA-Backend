import { proto } from '@whiskeysockets/baileys';

export function getMessageData(messages: proto.IWebMessageInfo[]) {
  const message = messages[0];
  if (!message) {
    console.log('No se que pasa jaja');
    console.log(message);
    return {};
  }
  const jid = getMessageJid(message);
  const pushName = getMessagePushName(message);
  return { jid, pushName };
}

function getMessageJid(message?: proto.IWebMessageInfo) {
  const jid = message?.key?.remoteJid;
  if (!jid) {
    console.log('Error, no jid found in: \n', JSON.stringify(message, null, 2));
    return '';
  }
  return jid;
}

function getMessagePushName(message: proto.IWebMessageInfo) {
  return message?.pushName ?? message.key.remoteJid?.split('@')[0] ?? '';
}
