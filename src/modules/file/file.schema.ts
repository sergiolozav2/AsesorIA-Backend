import { Type } from '@sinclair/typebox';

const RequestStoreImageBody = Type.Object({
  url: Type.String({ format: 'uri' }),
});
export const RequestStoreImageSchema = {
  body: RequestStoreImageBody,
};
