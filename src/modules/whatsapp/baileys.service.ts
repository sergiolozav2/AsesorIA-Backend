import {
  FindAuthKeyType,
  InsertAuthKeyType,
  InsertChatAndClient,
  InsertMessageType,
  SelectChatAndClientType,
} from './baileys.schema';
import {
  AuthStoreFunctions,
  MessageHandlerFunctions,
  MessagesEventType,
} from '@api/baileys/BaileysManager/types';
import { BaileysRepository } from './baileys.repository';
import { ClientRepository } from '../client/client.repository';
import { BaileysHelper } from './baileys.helper';
import { FileService } from '../file/file.service';
import { proto } from '@whiskeysockets/baileys';

export class BaileysService
  implements AuthStoreFunctions, MessageHandlerFunctions
{
  constructor(
    baileysRP?: BaileysRepository,
    clientRP?: ClientRepository,
    baileysHelper?: BaileysHelper,
    fileService?: FileService,
  ) {
    this.baileysRepository = baileysRP ?? new BaileysRepository();
    this.clientRepository = clientRP ?? new ClientRepository();
    this.helper = baileysHelper ?? new BaileysHelper();
    this.fileService = fileService ?? new FileService();
  }

  baileysRepository: BaileysRepository;
  clientRepository: ClientRepository;
  helper: BaileysHelper;
  fileService: FileService;

  async deleteAuthKey(data: FindAuthKeyType) {
    return await this.baileysRepository.deleteAuthKey(data);
  }

  async getAllSessions() {
    return this.baileysRepository.getAllSessions();
  }

  async findAuthKey(data: FindAuthKeyType) {
    const authKey = await this.baileysRepository.findAuthKey(data);
    if (!authKey) {
      return null;
    }
    return authKey.keyJSON;
  }

  async insertOrUpdateAuthKey(data: InsertAuthKeyType) {
    // const authKey = await this.baileysRepository.findAuthKey(data);

    // console.log(
    //   'INSERT/UPDATE KEY: ',
    //   authKey?.keyJSON,
    //   data.key
    //   authKey?.waSessionAuthKeyID,
    // );
    // if (authKey?.waSessionAuthKeyID) {
    //   return await this.baileysRepository.updateAuthKey(
    //     authKey.waSessionAuthKeyID,
    //     authKey.keyJSON,
    //   );
    // }
    return await this.baileysRepository.insertAuthKey(data);
  }

  async handleWhatsappMessages(data: MessagesEventType) {
    const { messages, companyID, waSessionID, getProfilePicture } = data;
    const jids: { [key: string]: string } = {};
    const validMessages: proto.IWebMessageInfo[] = [];
    for (const message of messages) {
      const { isText, fromGroup, pushName } =
        this.helper.getMessageContent(message);
      if (!isText || fromGroup) continue;
      if (!message.key.id) continue;

      jids[message.key.remoteJid] = pushName;
      validMessages.push(message);
    }

    const chatPromises: Promise<SelectChatAndClientType>[] = [];
    for (const jid in jids) {
      const pushName = jids[jid];

      const chatPromise = this.getOrCreateChatAndClient(
        waSessionID,
        jid,
        companyID,
        pushName,
        getProfilePicture,
      );
      chatPromises.push(chatPromise);
    }

    const results = await Promise.allSettled(chatPromises);

    const chats: SelectChatAndClientType[] = [];
    for (const result of results) {
      if (result.status === 'rejected') {
        continue;
      }
      const value = result.value;
      chats.push(value);
    }

    const mapJidToChatID = this.helper.getMapJidToChatID(chats);

    const storeMessages: InsertMessageType[] = [];
    for (const message of validMessages) {
      const { jid, fromMe } = this.helper.getMessageContent(message);
      const chatID = mapJidToChatID[jid];
      storeMessages.push({
        chatID,
        fromMe,
        content: message.message,
      });
    }
    if (storeMessages.length > 0) {
      console.log(`Storing ${storeMessages.length} messages`);
      this.baileysRepository.createManyMessages(storeMessages).catch((e) => {
        console.log('Error saving messages: ', e);
      });
    }
  }

  private async getOrCreateChatAndClient(
    waSessionID: string,
    jid: string,
    companyID: number,
    firstName: string,
    getProfilePicture: (jid: string) => Promise<string>,
  ) {
    try {
      const result = await this.baileysRepository.findChatAndClient(
        jid,
        waSessionID,
      );

      if (result?.chat) {
        return result;
      }
    } catch (e) {
      console.log('Error obtaining chat and client: ', e);
    }

    try {
      const result = await this.createChatAndClient(
        {
          chat: {
            companyID,
            jid,
            waSessionID,
          },
          client: {
            companyID,
            firstName,
          },
        },
        getProfilePicture,
      );
      return result;
    } catch (e) {
      console.log('Error creating chat and client: ', e);
    }
  }
  private async createChatAndClient(
    data: InsertChatAndClient,
    getProfilePicture: (jid: string) => Promise<string>,
  ) {
    const result = await this.baileysRepository.createChatAndClient(data);
    const jid = data.chat.jid;
    let profilePictureURL = null;
    try {
      profilePictureURL = await getProfilePicture(jid);
    } catch (e) {
      console.log('Error getting profile picture: ', e);
    }
    const url = await this.fileService.storeImageFromURL(profilePictureURL);

    const clientID = result.client.clientID;
    this.clientRepository
      .update({ profilePicture: url }, clientID)
      .catch((e) => {
        console.log('Failed to update user profile picture: ', e);
      });
    return result;
  }
}
