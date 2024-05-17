import makeWASocket from '@whiskeysockets/baileys';

export type WaSessionType = ReturnType<typeof makeWASocket>;

export type GetAllSessionsType = () => Promise<
  {
    companyID: number;
    waSessionID: string;
  }[]
>;
