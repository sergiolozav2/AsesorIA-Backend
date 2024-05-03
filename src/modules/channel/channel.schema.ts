import { Type } from '@sinclair/typebox';

export const RequestGetAllSessionResponse = Type.Object({
  list: Type.Array(
    Type.Object({
      waSessionID: Type.String(),
      name: Type.String(),
      createdAt: Type.String({ format: 'date' }),
    }),
  ),
});
export const RequestGetAllSessionSchema = {
  response: {
    200: RequestGetAllSessionResponse,
  },
};

export const RequestResetSession = Type.Object({
  waSessionID: Type.String(),
});
export const RequestResetSessionSchema = {
  body: RequestResetSession,
};
