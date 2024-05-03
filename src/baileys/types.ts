import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';

export type SesionWA = ReturnType<typeof makeWASocket>;

interface FindAuthKey {
  waSessionID: string;
  key: string;
}

export interface AuthStoreFunctions {
  getKey: (data: FindAuthKey) => Promise<string>;
  deleteKey: (data: FindAuthKey) => Promise<void>;
  saveKey: (data: FindAuthKey & { keyJSON: string }) => Promise<void>;
}

export type UseAuthStateType = typeof useMultiFileAuthState;
export type GetAllSessionsType = () => Promise<
  {
    companyID: number;
    waSessionID: string;
  }[]
>;
