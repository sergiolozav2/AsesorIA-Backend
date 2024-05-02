import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { SesionWA } from './types';
import { messagesHandler } from './handlers/messagesHandler';

export const activeSessions: {
  [key: string]: SesionWA | undefined;
} = {};

export async function getSession(sessionID: string) {
  const session = activeSessions[sessionID];
  let timeout = 0;
  if (!session) {
    timeout = 4000;
    const { session } = await createSession(sessionID);
    return { session, timeout };
  }
  return { session, timeout };
}

export async function createSession(sessionID: string) {
  const { state, saveCreds } = await useMultiFileAuthState(sessionID);
  const session = makeWASocket({
    browser: Browsers.windows('Chrome'),
    auth: state,
  });
  session.ev.on('creds.update', saveCreds);
  session.ev.on('messages.upsert', ({ messages, type }) =>
    messagesHandler({
      messages,
      type,
      sessionID,
    }),
  );
  activeSessions[sessionID] = session;
  return { session, state };
}
