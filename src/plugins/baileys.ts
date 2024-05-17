import { BaileysManager } from '@api/baileys/BaileysManager/baileysManager';
import { BaileysService } from '@api/modules/whatsapp/baileys.service';
import { FastifyInstance } from 'fastify';

import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    baileys: BaileysManager;
  }
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const baileysService = new BaileysService();
    const baileys = new BaileysManager(baileysService);
    fastify.decorate('baileys', baileys);

    await baileys.startStoredSessions();
  },
  { name: 'baileys', dependencies: ['config', 'db', 's3'] },
);
