import { getSession } from './sessions';
import { getSessionFolders } from './utils/getSessionsFolder';

export async function startStoredSessions() {
  const sessionIDs = await getSessionFolders();
  const sessionPromises: any = [];
  for (const sessionID of sessionIDs) {
    sessionPromises.push(getSession(sessionID));
  }

  const promises = await Promise.allSettled(sessionPromises);
  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i];
    if (promise.status === 'rejected') {
      console.log('Fallo esta sesión: ', sessionIDs[i]);
      continue;
    }
  }
  console.log('Cuentas de Whatsapp inicializadas');
}
