import { BaileysManager } from '@api/baileys/BaileysManager/baileysManager';
import { ChannelRepository } from './channel.repository';

export class ChannelService {
  constructor(baileysManager: BaileysManager, chatRP?: ChannelRepository) {
    this.chatRepository = chatRP ?? new ChannelRepository();
    this.baileysManager = baileysManager;
  }

  private chatRepository: ChannelRepository;
  private baileysManager: BaileysManager;

  async getAllSessions(companyID: number) {
    const chats = await this.chatRepository.getCompanySessions(companyID);
    return chats;
  }

  async deleteSession(waSessionID: string) {
    const deleted = await this.chatRepository.deleteSession(waSessionID);
    this.baileysManager.deleteSession(waSessionID);
    return deleted;
  }
}
