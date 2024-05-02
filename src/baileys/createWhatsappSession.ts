import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { connectionHandler } from './handlers/connectionHandler';
import { activeSessions } from './sessions';
import { BaileysCallbacks } from './types';
import { rootPath } from './utils/getSessionsFolder';

export async function createWhatsappSession(
  sessionID: string,
  callbacks: BaileysCallbacks,
  reconnectRequired: boolean = false,
) {
  const { state, saveCreds } = await useMultiFileAuthState(
    `${rootPath}/${sessionID}`,
  );

  if (state.creds.account && !reconnectRequired) {
    callbacks.onError('Ya existe una cuenta');
    return;
  }

  const socket = makeWASocket({
    browser: Browsers.ubuntu('Chrome'),
    generateHighQualityLinkPreview: true,
    auth: state,
  });

  // ESTA LINEA ES IMPORTANTE PARA ENVÍAR MENSAJES
  activeSessions[sessionID] = socket;

  function restartRequired() {
    createWhatsappSession(sessionID, callbacks, true);
  }

  function handleClosed(message: string) {
    if (message === 'reconnect') {
      restartRequired();
      return;
    }
    socket.end(new Error('Desconectado'));
  }
  socket.ev.on('creds.update', saveCreds);
  socket.ev.on('connection.update', (update) => {
    connectionHandler(update, handleClosed, callbacks);
  });
}
