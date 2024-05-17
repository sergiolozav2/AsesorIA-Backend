import { GetAllSessionsType, WaSessionType } from '../types';
import { WhatsappEventEmitterType } from '../whatsappEvents';
import { baseConnectionHandler } from './baseConnectionHandler';
import makeWASocket, { Browsers } from '@whiskeysockets/baileys';
import { baseAuthStore } from './baseAuthStore';
import { UseAuthStateType } from './types';
import { BaileysService } from '@api/modules/whatsapp/baileys.service';

export class BaileysManager {
  constructor(baileysService: BaileysService) {
    // Tengo que usar callbacks porque si uso el método directamente
    // el enlace a 'this' cambia dentro de 'useAuthState' y el repositorio
    // no puede encontrar a 'this.db'

    // Si no se entendió es porque Javascript es raro

    this.useAuthState = baseAuthStore({
      deleteAuthKey: async (args) => baileysService.deleteAuthKey(args),
      findAuthKey: async (args) => baileysService.findAuthKey(args),
      insertOrUpdateAuthKey: async (args) =>
        baileysService.insertOrUpdateAuthKey(args),
    });

    this.getAllSessions = (...args) => baileysService.getAllSessions(...args);
    this.activeSessions = {};

    this.baileysService = baileysService;
  }

  useAuthState: UseAuthStateType;
  baileysService: BaileysService;
  getAllSessions: GetAllSessionsType;
  activeSessions: {
    [key: string]: WaSessionType | undefined;
  };
  private MAX_RECONNECT_ATTEMPTS = 2;

  async createWhatsappSession(
    sessionID: string,
    companyID: number,
    emitter: WhatsappEventEmitterType,
    reconnectAttempts = 0,
  ) {
    const { session } = await this.createSocket(sessionID, companyID);
    emitter.on('reconnect', () => {
      this.deleteSession(sessionID);
      console.log('Restarting connection, attempt: ', reconnectAttempts + 1);
      this.createWhatsappSession(
        sessionID,
        companyID,
        emitter,
        reconnectAttempts + 1,
      );
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
    console.log('Starting whatsapp sessions...');
    const sessionIDs = await this.getAllSessions();
    console.log(`Starting: ${sessionIDs.length} sessions found`);
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
        console.log('Session failed: ', sessionIDs[i]);
        continue;
      }
    }
    console.log('Whatsapp sessions setup completed');
  }

  async deleteSession(sessionID: string) {
    const session = this.activeSessions[sessionID];
    if (!session) {
      return;
    }
    session.end(new Error('Session deleted'));
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

  private async createSocket(waSessionID: string, companyID: number) {
    const { state, saveCreds } = await this.useAuthState(waSessionID);
    const session = makeWASocket({
      auth: state,
      browser: Browsers.windows('Chrome'),
    });
    session.ev.on('creds.update', saveCreds);
    session.ev.on('messages.upsert', ({ messages, type }) => {
      this.baileysService.handleWhatsappMessages({
        messages,
        companyID,
        type,
        waSessionID,
        getProfilePicture: session.profilePictureUrl,
      });
    });
    this.activeSessions[waSessionID] = session;
    return { session, state };
  }
}
