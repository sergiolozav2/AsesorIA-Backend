import path from 'path';
import fs from 'fs';

export const rootPath = 'wa_sessions';

export async function getSessionFolders() {
  const sessionIDs = new Promise<string[]>((resolve, reject) => {
    try {
      fs.mkdirSync(rootPath);
    } catch (e) {
      console.log(e);
    }
    fs.readdir(rootPath, (err, items) => {
      if (err) {
        reject(err);
        return;
      }
      const directories: string[] = [];
      items.map((item) => {
        const itemPath = path.join(rootPath, item);
        const stats = fs.statSync(itemPath);
        if (stats?.isDirectory()) {
          directories.push(itemPath);
        }
      });
      resolve(directories);
    });
  });

  return sessionIDs;
}
