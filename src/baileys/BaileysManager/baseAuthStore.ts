import {
  WAProto as proto,
  initAuthCreds,
  BufferJSON,
} from '@whiskeysockets/baileys';
import { AuthStoreFunctions, UseAuthStateType } from '../types';

export function baseAuthStore(functions: AuthStoreFunctions) {
  async function saveAuthKey(waSessionID: string, key: string, data: string) {
    const keyJSON = JSON.stringify(data, BufferJSON.replacer);
    await functions.saveKey({
      key,
      waSessionID,
      keyJSON,
    });
  }
  async function getAuthKey(waSessionID: string, key: string) {
    try {
      const rawData = await functions.getKey({ key, waSessionID });
      const parsedData = JSON.parse(rawData, BufferJSON.reviver);
      return parsedData;
    } catch (error) {
      console.log(`ReadData failed: ${error}`);
    }
  }
  async function deleteAuthKey(waSessionID: string, key: string) {
    try {
      await functions.deleteKey({ key, waSessionID });
    } catch (error) {
      console.log(`Delete failed: ${error}`);
    }
  }

  async function useAuthStore(sessionID: string): ReturnType<UseAuthStateType> {
    let credentials = await getAuthKey(sessionID, 'creds');
    if (!credentials) {
      credentials = initAuthCreds();
      await saveAuthKey(sessionID, 'creds', credentials);
    }
    return {
      state: {
        creds: credentials,
        keys: {
          get: async (type: string, ids: string[]) => {
            const data = {};
            await Promise.all(
              ids.map(async (id: string) => {
                let value = await getAuthKey(sessionID, `${type}-${id}`);
                if (type === 'app-state-sync-key' && value) {
                  value = proto.Message.AppStateSyncKeyData.fromObject(value);
                }
                data[id] = value;
              }),
            );
            return data;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set: async (data: any) => {
            const tasks: Promise<void>[] = [];
            for (const category in data) {
              for (const id in data[category]) {
                const value = data[category][id];
                const key = `${category}-${id}`;
                tasks.push(
                  value
                    ? saveAuthKey(sessionID, key, value)
                    : deleteAuthKey(sessionID, key),
                );
              }
            }
            await Promise.all(tasks);
          },
        },
      },
      saveCreds: async () => {
        await saveAuthKey(sessionID, 'creds', credentials);
      },
    };
  }
  return useAuthStore;
}
