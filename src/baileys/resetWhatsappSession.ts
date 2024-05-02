import { getSession } from './sessions';
import { rootPath } from './utils/getSessionsFolder';

export async function resetWhatsappSession(sessionID: string) {
  const trueSessionID = `${rootPath}/${sessionID}`;
  await getSession(trueSessionID);
}
