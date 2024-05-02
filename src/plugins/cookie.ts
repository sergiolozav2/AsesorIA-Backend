import { FastifyInstance } from 'fastify';

import fastifyCookie, { CookieSerializeOptions } from '@fastify/cookie';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyReply {
    setCookieAuthorization: (token: string) => void;
    clearCookieAuthorization: () => void;
    setCookieIsLoggedIn: () => void;
    clearCookieIsLoggedIn: () => void;
  }
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie, {
      secret: fastify.config.SECRET_COOKIE,
      parseOptions: {},
    });

    const hours = fastify.config.JWT_DURATION_HOURS;
    const domain = fastify.config.COOKIE_DOMAIN;
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000);

    const defaultCookieConfig: CookieSerializeOptions = {
      expires,
      domain,
      sameSite: 'lax',
      path: '/',
      secure: true,
    };
    fastify.decorateReply('setCookieAuthorization', function (token: string) {
      this.setCookie('authorization', token, {
        ...defaultCookieConfig,
        httpOnly: true,
      });
    });
    fastify.decorateReply('clearCookieAuthorization', function () {
      this.clearCookie('authorization');
    });
    fastify.decorateReply('setCookieIsLoggedIn', function () {
      this.setCookie('isLoggedIn', '1', {
        ...defaultCookieConfig,
        httpOnly: false,
      });
    });
    fastify.decorateReply('clearCookieIsLoggedIn', function () {
      this.clearCookie('isLoggedIn');
    });
  },
  { name: 'cookie', dependencies: ['config'] },
);
