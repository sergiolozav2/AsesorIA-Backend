import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys';
import { toDataURL } from 'qrcode';
import { BaileysCallbacks } from '../types';

export async function connectionHandler(
  update: Partial<ConnectionState>,
  handleClosed: (message: string) => void,
  callbacks: BaileysCallbacks,
) {
  const { connection } = update;

  const onError = (error: any) => callbacks.onError(error);
  if (connection === 'open') {
    handleConnectionOpen(callbacks.onScannedQR).catch(onError);
  }
  if (connection === 'close') {
    handleConnectionClosed(update, handleClosed, callbacks.onError);
  }

  handleConnectionQR(update, callbacks.onLoadedQR).catch(onError);
}

export async function handleConnectionClosed(
  update: Partial<ConnectionState>,
  handleClosed: (message: string) => void,
  onError: (message: string) => void,
) {
  const code = (update.lastDisconnect?.error as any)?.output?.statusCode;
  const restartRequired = code === DisconnectReason.restartRequired;
  if (restartRequired) {
    handleClosed('reconnect');
    return;
  }
  handleClosed('error');
  onError(code.toString());
}

export async function handleConnectionOpen(onScannedQR: () => void) {
  onScannedQR();
}

export async function handleConnectionQR(
  update: Partial<ConnectionState>,
  onLoadedQR: (qr: string) => void,
) {
  console.log('SI HAY QR: ', update.qr);
  const rawQR = update.qr;
  if (rawQR?.length) {
    const qr = await toDataURL(rawQR);
    onLoadedQR(qr);
  }
}
