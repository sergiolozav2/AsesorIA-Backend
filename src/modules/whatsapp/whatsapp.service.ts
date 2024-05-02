import { randomUUID } from 'crypto';
import { WhatsappRepository } from './whatsapp.repository';
import { UserType } from '@fastify/jwt';
import { createWhatsappSession } from '@api/baileys/createWhatsappSession';
import { WhatsappEventEmitterType } from '@api/baileys/whatsappEvents';

export class WhatsappService {
  constructor(whatsappRP?: WhatsappRepository) {
    this.whatsappRepository = whatsappRP ?? new WhatsappRepository();
  }

  private whatsappRepository: WhatsappRepository;

  async createSession(user: UserType, emitter: WhatsappEventEmitterType) {
    const waSessionID = randomUUID();
    emitter.on('open', () => {
      this.whatsappRepository.create({
        companyID: user.companyID,
        createdBy: user.userID,
        name: waSessionID,
        waSessionID: waSessionID,
      });
    });
    createWhatsappSession(waSessionID, emitter);
    return user;
  }
}
