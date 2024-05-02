import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyJwt, { JWT } from '@fastify/jwt';
import { InvalidTokenError } from '@api/errors/errors';

export type TokenPayload = {
  userID: number;
  companyID: number;
  type?: 'jwt' | 'refresh';
};

export type UserType = Omit<TokenPayload, 'type'>;

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  interface FastifyInstance {
    authenticate(request: FastifyRequest): Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }

  interface JWT {
    createRefreshToken: (refreshTokenPayload: TokenPayload) => string;
    createAccessToken: (accessTokenPayload: TokenPayload) => string;
  }
}

export let jwt: JWT;

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyJwt, {
      secret: fastify.config.SECRET_JWT,
    });

    jwt = fastify.jwt;

    jwt.createRefreshToken = (refreshTokenPayload: TokenPayload) => {
      refreshTokenPayload.type = 'refresh';
      return jwt.sign(refreshTokenPayload, { expiresIn: '14d' });
    };

    jwt.createAccessToken = (accessTokenPayload: TokenPayload) => {
      accessTokenPayload.type = 'jwt';
      return jwt.sign(accessTokenPayload, { expiresIn: '24h' });
    };

    function validate(token: string | undefined) {
      try {
        if (!token) {
          throw new InvalidTokenError();
        }
        return jwt.verify<TokenPayload>(token);
      } catch (e) {
        throw new InvalidTokenError();
      }
    }

    fastify.decorate('authenticate', async (req: FastifyRequest) => {
      const token = req.cookies.authorization;
      req.user = validate(token);
    });
  },
  { dependencies: ['config', 'cookie'] },
);
