import makeWASocket from '@whiskeysockets/baileys';

export type SesionWA = ReturnType<typeof makeWASocket>;
export interface BaileysCallbacks {
  onLoadedQR: (qrURI: string) => void;
  onError: (message: string) => void;
  onScannedQR: () => void;
}
