import { messagesHandler } from './handlers/messagesHandler';
import { getSession } from './sessions';
import { getSessionFolders } from './utils/getSessionsFolder';

export async function initializeSessions() {
  const sessionIDs = await getSessionFolders();
  const sessionPromises: any = [];
  for (const sessionID of sessionIDs) {
    sessionPromises.push(getSession(sessionID));
  }

  const promises = await Promise.allSettled(sessionPromises);
  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i];
    const sessionID = sessionIDs[i];
    if (promise.status === 'rejected') {
      continue;
    }
    const session = promise.value.session;
    session.ev.on('messages.upsert', ({ messages, type }) =>
      messagesHandler({
        messages,
        type,
        sessionID,
      }),
    );
  }
  console.log('Cuentas de Whatsapp inicializadas');
}
