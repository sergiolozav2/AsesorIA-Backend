import { randomUUID } from 'crypto';
import { WhatsappRepository } from './whatsapp.repository';
import { UserType } from '@fastify/jwt';
import { createWhatsappSession } from '@api/baileys/createWhatsappSession';
import { BaileysCallbacks } from '@api/baileys/types';

export class WhatsappService {
  constructor(whatsappRP?: WhatsappRepository) {
    this.whatsappRepository = whatsappRP ?? new WhatsappRepository();
  }

  private whatsappRepository: WhatsappRepository;

  async createSession(user: UserType, callbacks: BaileysCallbacks) {
    const waSessionID = randomUUID();

    const overrideOnScannerQR = () => {
      this.whatsappRepository.create({
        companyID: user.companyID,
        createdBy: user.userID,
        name: waSessionID,
        waSessionID: waSessionID,
      });
      callbacks.onScannedQR();
    };
    createWhatsappSession(waSessionID, {
      ...callbacks,
      onScannedQR: overrideOnScannerQR,
    });
    return user;
  }
}
