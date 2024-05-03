import { randomUUID } from 'crypto';
import { WhatsappRepository } from './whatsapp.repository';
import { UserType } from '@fastify/jwt';
import { WhatsappEventEmitterType } from '@api/baileys/whatsappEvents';
import { BaileysManager } from '@api/baileys/BaileysManager/baileysManager';

export class WhatsappService {
  constructor(whatsappRP?: WhatsappRepository) {
    this.whatsappRepository = whatsappRP ?? new WhatsappRepository();
  }

  private whatsappRepository: WhatsappRepository;

  async createSession(
    user: UserType,
    emitter: WhatsappEventEmitterType,
    bailey: BaileysManager,
  ) {
    const waSessionID = randomUUID();
    emitter.on('open', () => {
      this.whatsappRepository.createChat({
        companyID: user.companyID,
        createdBy: user.userID,
        name: waSessionID,
        waSessionID: waSessionID,
      });
    });
    bailey.createWhatsappSession(waSessionID, user.companyID, emitter);
    return user;
  }
}
