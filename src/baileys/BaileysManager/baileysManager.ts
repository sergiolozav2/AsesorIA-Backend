import { GetAllSessionsType, SesionWA, UseAuthStateType } from '../types';
import { WhatsappEventEmitterType } from '../whatsappEvents';
import { baseConnectionHandler } from './baseConnectionHandler';
import makeWASocket, { Browsers } from '@whiskeysockets/baileys';
import { BaileysRepository } from '@api/modules/whatsapp/baileys.repository';
import { MessageHandlerType, baseMessageHandler } from './baseMessageHandler';
import { baseAuthStore } from './baseAuthStore';

export class BaileysManager {
  constructor(baileysRepository: BaileysRepository) {
    // Tengo que usar callbacks porque si uso el método directamente
    // el enlace a 'this' cambia dentro de 'useAuthState' y el repositorio
    // no puede encontrar a 'this.db'

    // Si no se entendió es porque Javascript es raro

    this.useAuthState = baseAuthStore({
      deleteKey: (args) => baileysRepository.deleteAuthKey(args),
      getKey: (args) => baileysRepository.findAuthKey(args),
      saveKey: (args) => baileysRepository.insertOrUpdateAuthKeys(args),
    });

    this.messageHandler = baseMessageHandler({
      findChatByID: (...args) => baileysRepository.findChatByID(...args),
      createChat: (...args) => baileysRepository.createChat(...args),
      createManyMessages: (...args) =>
        baileysRepository.createManyMessages(...args),
    });

    this.getAllSessions = (...args) =>
      baileysRepository.getAllSessions(...args);
    this.activeSessions = {};
  }

  useAuthState: UseAuthStateType;
  messageHandler: MessageHandlerType;
  getAllSessions: GetAllSessionsType;
  activeSessions: {
    [key: string]: SesionWA | undefined;
  };

  async createWhatsappSession(
    sessionID: string,
    companyID: number,
    emitter: WhatsappEventEmitterType,
    reconnectRequired = false,
  ) {
    const { state, session } = await this.createSocket(sessionID, companyID);

    if (state.creds.account && !reconnectRequired) {
      emitter.emit('error', 'Ya existe una cuenta con esa ID');
      return;
    }

    emitter.on('reconnect', () => {
      this.createWhatsappSession(sessionID, companyID, emitter, true);
    });

    emitter.on('error', (code) => {
      session.end(new Error(`Conexión finalizada: ${code}`));
      emitter.removeAllListeners();
    });

    session.ev.on('connection.update', (update) => {
      baseConnectionHandler(update, emitter);
    });
  }

  async startStoredSessions() {
    console.log('Iniciando sesiones');
    const sessionIDs = await this.getAllSessions();
    console.log(`Iniciar: ${sessionIDs.length} sesiones encontradas`);
    const sessionPromises: any = [];
    for (const sessionID of sessionIDs) {
      const { companyID, waSessionID } = sessionID;
      const session = this.getSession(waSessionID, companyID);
      sessionPromises.push(session);
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

  async deleteSession(sessionID: string) {
    const session = this.activeSessions[sessionID];
    if (!session) {
      return;
    }
    session.end(new Error('Sesión eliminada'));
    this.activeSessions[sessionID] = null;
    delete this.activeSessions[sessionID];
  }

  async getSession(sessionID: string, companyID: number) {
    const session = this.activeSessions[sessionID];
    let timeout = 0;
    if (!session) {
      timeout = 4000;
      const { session } = await this.createSocket(sessionID, companyID);
      return { session, timeout };
    }
    return { session, timeout };
  }

  private async createSocket(sessionID: string, companyID: number) {
    const { state, saveCreds } = await this.useAuthState(sessionID);
    const session = makeWASocket({
      browser: Browsers.windows('Chrome'),
      auth: state,
    });
    session.ev.on('creds.update', saveCreds);
    session.ev.on('messages.upsert', ({ messages, type }) =>
      this.messageHandler({
        messages,
        type,
        sessionID,
        companyID,
      }),
    );
    this.activeSessions[sessionID] = session;
    return { session, state };
  }
}