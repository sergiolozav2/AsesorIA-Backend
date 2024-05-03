import { BaileysManager } from '@api/baileys/BaileysManager/baileysManager';
import { BaileysRepository } from '@api/modules/whatsapp/baileys.repository';
import { FastifyInstance } from 'fastify';

import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    baileys: BaileysManager;
  }
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const baileysRepository = new BaileysRepository();
    const baileys = new BaileysManager(baileysRepository);
    fastify.decorate('baileys', baileys);

    await baileys.startStoredSessions();
  },
  { name: 'baileys', dependencies: ['config', 'db'] },
);
