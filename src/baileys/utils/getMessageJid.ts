import { proto } from '@whiskeysockets/baileys';

export function getMessageJid(messages: proto.IWebMessageInfo[]) {
  const jid = messages[messages.length - 1].key.remoteJid;
  if (!jid) {
    console.log(
      'Error, no jid found in: \n',
      JSON.stringify(messages, null, 2),
    );
    throw new Error('No jid found');
  }
  return jid;
}
