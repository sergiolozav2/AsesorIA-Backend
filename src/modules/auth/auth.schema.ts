import { Static, Type } from '@sinclair/typebox';
import { InsertUserSchema, SelectUserSchema } from '../user/user.schema';
import {
  InsertCompanySchema,
  SelectCompanySchema,
} from '../company/company.schema';

export type RegisterRequestType = Static<typeof RegisterRequestSchema>;
export const RegisterRequestSchema = Type.Object({
  user: InsertUserSchema,
  company: InsertCompanySchema,
});

export const RegisterSchema = {
  body: RegisterRequestSchema,
};

export type LoginRequestType = Static<typeof LoginRequestSchema>;
export const LoginRequestSchema = Type.Object({
  password: Type.String(),
  email: Type.String({ format: 'email' }),
});
export const LoginRequestResponse = Type.Object({
  user: SelectUserSchema,
  company: SelectCompanySchema,
});

export const LoginSchema = {
  body: LoginRequestSchema,
  response: {
    200: LoginRequestResponse,
  },
};
