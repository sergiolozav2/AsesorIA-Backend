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

export const RequestDeleteSessionBody = Type.Object({
  waSessionID: Type.String(),
});
export const RequestDeleteSessionResponse = Type.Object({
  waSessionID: Type.String(),
});
export const RequestDeleteSessionSchema = {
  body: RequestDeleteSessionBody,
  response: {
    200: RequestDeleteSessionResponse,
  },
};
