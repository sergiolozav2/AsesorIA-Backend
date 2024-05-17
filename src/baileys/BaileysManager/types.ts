import {
  MessageUpsertType,
  proto,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';

// Message handler types
export interface MessageHandlerFunctions {
  handleWhatsappMessages: (data: MessagesEventType) => Promise<void>;
}

export type MessagesEventType = {
  messages: proto.IWebMessageInfo[];
  type: MessageUpsertType;
  waSessionID: string;
  companyID: number;
  getProfilePicture: (jid: string) => Promise<string>;
};

export type MessageHandlerReturnType = (
  data: MessagesEventType,
) => Promise<void>;

// AuthStore types
interface FindAuthKey {
  waSessionID: string;
  key: string;
}

export interface AuthStoreFunctions {
  findAuthKey: (data: FindAuthKey) => Promise<string>;
  deleteAuthKey: (data: FindAuthKey) => Promise<boolean>;
  insertOrUpdateAuthKey: (
    data: FindAuthKey & { keyJSON: string },
  ) => Promise<boolean>;
}

export type UseAuthStateType = typeof useMultiFileAuthState;
export type UseAuthStateReturnType = ReturnType<UseAuthStateType>;
