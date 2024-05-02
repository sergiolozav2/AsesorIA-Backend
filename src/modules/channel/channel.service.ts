import { ChannelRepository } from './channel.repository';

export class ChannelService {
  constructor(chatRP?: ChannelRepository) {
    this.chatRepository = chatRP ?? new ChannelRepository();
  }

  private chatRepository: ChannelRepository;

  async getAllSessions(companyID: number) {
    const chats = await this.chatRepository.getAllSessions(companyID);
    return chats;
  }
}
