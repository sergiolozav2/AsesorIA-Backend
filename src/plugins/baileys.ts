import { createWhatsappSession } from '@api/baileys/createWhatsappSession';
import { resetWhatsappSession } from '@api/baileys/resetWhatsappSession';
import { startStoredSessions } from '@api/baileys/startStoredSessions';
import { WhatsappEventEmitterType } from '@api/baileys/whatsappEvents';
import { FastifyInstance } from 'fastify';

import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    baileys: {
      createWhatsappSession: (
        sessionID: string,
        emitter: WhatsappEventEmitterType,
      ) => Promise<void>;
      resetWhatsappSession: (sessionID: string) => Promise<void>;
    };
  }
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    fastify.decorate('baileys', {
      createWhatsappSession: createWhatsappSession,
      resetWhatsappSession: resetWhatsappSession,
    });

    await startStoredSessions();
  },
  { name: 'baileys', dependencies: ['config', 'db'] },
);
