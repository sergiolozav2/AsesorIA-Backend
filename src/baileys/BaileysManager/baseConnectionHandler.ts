import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys';
import { toDataURL } from 'qrcode';
import { WhatsappEventEmitterType } from '../whatsappEvents';

export async function baseConnectionHandler(
  update: Partial<ConnectionState>,
  emitter: WhatsappEventEmitterType,
) {
  const { connection } = update;

  if (connection === 'open') {
    emitter.emit('open', '');
  }
  if (connection === 'close') {
    if (shouldReconnect(update)) {
      emitter.emit('reconnect');
      return;
    } else {
      emitter.emit('error', getUpdateStatusCode(update));
    }
  }
  const qr = await getQR(update);
  if (qr) {
    emitter.emit('qr', qr);
  }
}

function getUpdateStatusCode(update: Partial<ConnectionState>) {
  return (update.lastDisconnect?.error as any)?.output?.statusCode;
}

async function getQR(update: Partial<ConnectionState>) {
  const rawQR = update.qr;
  if (rawQR?.length) {
    const qr = await toDataURL(rawQR);
    return qr;
  }
  return;
}
function shouldReconnect(update: Partial<ConnectionState>) {
  const code = getUpdateStatusCode(update);
  const restartRequired = code === DisconnectReason.restartRequired;
  return restartRequired;
}
