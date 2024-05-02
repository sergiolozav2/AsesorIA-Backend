import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { SesionWA } from './types';

export const activeSessions: {
  [key: string]: SesionWA | undefined;
} = {};

export async function getSession(sessionID: string) {
  let session = activeSessions[sessionID];
  let timeout = 0;
  if (!session) {
    timeout = 4000;
    const { state, saveCreds } = await useMultiFileAuthState(sessionID);
    session = makeWASocket({
      printQRInTerminal: true,
      browser: Browsers.windows('Chrome'),
      auth: state,
    });
    session.ev.on('creds.update', saveCreds);
    activeSessions[sessionID] = session;
  }
  return { session, timeout };
}
