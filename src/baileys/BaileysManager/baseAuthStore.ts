import {
  WAProto as proto,
  initAuthCreds,
  BufferJSON,
} from '@whiskeysockets/baileys';
import { AuthStoreFunctions, UseAuthStateReturnType } from './types';

export function baseAuthStore(functions: AuthStoreFunctions) {
  async function useAuthStore(waSessionID: string): UseAuthStateReturnType {
    async function writeData(key: string, data: string) {
      const keyJSON = JSON.stringify(data, BufferJSON.replacer);
      return await functions.insertOrUpdateAuthKey({
        key,
        waSessionID,
        keyJSON,
      });
    }
    async function readData(key: string) {
      try {
        const rawData = await functions.findAuthKey({ key, waSessionID });
        const parsedData = JSON.parse(rawData, BufferJSON.reviver);
        return parsedData;
      } catch (error) {
        console.log(`ReadData failed: ${error}`);
      }
    }
    async function deleteAuthKey(key: string) {
      try {
        return await functions.deleteAuthKey({ key, waSessionID });
      } catch (error) {
        console.log(`Delete failed: ${error}`);
      }
    }

    let credentials = await readData('creds');
    if (!credentials) {
      credentials = initAuthCreds();
    }
    return {
      state: {
        creds: credentials,
        keys: {
          get: async (type: string, ids: string[]) => {
            const data = {};
            await Promise.all(
              ids.map(async (id: string) => {
                let value = await readData(`${type}-${id}`);
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
            const tasks: Promise<boolean>[] = [];
            for (const category in data) {
              for (const id in data[category]) {
                const value = data[category][id];
                const key = `${category}-${id}`;
                tasks.push(value ? writeData(key, value) : deleteAuthKey(key));
              }
            }
            await Promise.all(tasks);
          },
        },
      },
      saveCreds: async () => {
        await writeData('creds', credentials);
      },
    };
  }
  return useAuthStore;
}
