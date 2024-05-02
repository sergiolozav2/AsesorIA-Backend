import { connectionHandler } from './handlers/connectionHandler';
import { createSession } from './sessions';
import { rootPath } from './utils/getSessionsFolder';
import { WhatsappEventEmitterType } from './whatsappEvents';

export async function createWhatsappSession(
  sessionID: string,
  emitter: WhatsappEventEmitterType,
  reconnectRequired: boolean = false,
) {
  const trueSessionID = `${rootPath}/${sessionID}`;
  const { state, session } = await createSession(trueSessionID);

  if (state.creds.account && !reconnectRequired) {
    emitter.emit('error', 'Ya existe una cuenta con esa ID');
    return;
  }

  // Pense que se repetían los listeners al usar 'reconnect'
  // Pero como crea un nuevo socket, debe repetirse al nuevo socket
  emitter.on('reconnect', () => {
    createWhatsappSession(sessionID, emitter, true);
  });

  emitter.on('error', (code) => {
    session.end(new Error(`Conexión finalizada: ${code}`));
    emitter.removeAllListeners();
  });

  session.ev.on('connection.update', (update) => {
    connectionHandler(update, emitter);
  });
}
