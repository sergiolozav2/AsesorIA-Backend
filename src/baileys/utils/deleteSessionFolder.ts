import path from 'path';
import fs from 'fs';
import { rootPath } from './getSessionsFolder';

export async function deleteSessionFolder(sessionID: string) {
  const sessionPath = path.join(rootPath, sessionID);
  fs.rmSync(sessionPath, { recursive: true, force: true });
  return true;
}
