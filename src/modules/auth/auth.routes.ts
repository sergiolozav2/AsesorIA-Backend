import { FastifyTypebox } from '@api/types/FastifyTypebox';
import { LoginSchema, RegisterSchema } from './auth.schema';
import { AuthService } from './auth.service';

export default function routes(
  fastify: FastifyTypebox,
  _: unknown,
  done: () => void,
) {
  const authService = new AuthService();

  fastify.post(
    '/register',
    {
      schema: RegisterSchema,
    },
    async (req) => {
      const result = await authService.registerRequest(req.body);
      return result;
    },
  );

  fastify.post(
    '/login',
    {
      schema: LoginSchema,
    },
    async (req, reply) => {
      const { user, company } = await authService.loginRequest(req.body);

      const token = fastify.jwt.createAccessToken({
        companyID: company.companyID,
        userID: user.userID,
      });

      reply.setCookieAuthorization(token);
      reply.setCookieIsLoggedIn();
      reply.send({ user, company });
    },
  );

  fastify.post('/logout', { schema: {} }, (req, reply) => {
    reply.clearCookieAuthorization();
    reply.clearCookieIsLoggedIn();
    return { message: 'ok' };
  });
  done();
}
