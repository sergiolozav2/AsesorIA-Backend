import { s3Client } from '@api/plugins/s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

export class FileRepository {
  constructor(s3?: S3Client) {
    if (!s3Client && !s3) {
      throw new Error(
        "Global 's3Client' instance hasn't been initialized and 's3' not found",
      );
    }
    this.s3 = s3 ?? s3Client;
  }

  private s3: S3Client;
  private imagesBucket = 'images';

  async storeImage(buffer: Uint8Array, fileExtension: string) {
    const uuid = randomUUID();
    const uploadCommand = new PutObjectCommand({
      Bucket: this.imagesBucket,
      Key: `${uuid}${fileExtension}`,
      Body: buffer,
    });

    const fileUrl = `${this.imagesBucket}/${uuid}`;
    await this.s3.send(uploadCommand);
    return fileUrl;
  }
}
