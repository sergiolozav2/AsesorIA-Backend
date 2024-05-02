import { ChatRepository } from './chat.repository';

export class ChatService {
  constructor(chatRP?: ChatRepository) {
    this.chatRepository = chatRP ?? new ChatRepository();
  }

  private chatRepository: ChatRepository;

  async allChats(companyID: number) {
    const chats = await this.chatRepository.findByCompanyID(companyID);
    return chats;
  }
}
