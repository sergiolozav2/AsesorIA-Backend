import { proto } from '@whiskeysockets/baileys';

export function getMessageContent(message: proto.IWebMessageInfo) {
  const timestamp = getMessageTimestamp(message);
  const isText = isTextMessage(message);
  const fromMe = isFromMe(message);
  return { timestamp, isText, fromMe };
}

function getMessageTimestamp(message: proto.IWebMessageInfo) {
  const timestamp = message?.messageTimestamp;
  if (timestamp) {
    return new Date(Number(timestamp) * 1000);
  }
  return new Date();
}

function isTextMessage(message: proto.IWebMessageInfo) {
  const content = message.message;
  if (content?.conversation) {
    return true;
  }
  if (content?.extendedTextMessage?.text) {
    return true;
  }
  return false;
}

function isFromMe(message: proto.IWebMessageInfo) {
  return message.key.fromMe;
}
