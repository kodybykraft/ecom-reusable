import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { StorageProvider, UploadInput, UploadResult } from '../../types/storage-provider.js';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** Public URL base, e.g. "https://media.stay-savage.com" or "https://pub-xxx.r2.dev" */
  publicUrl: string;
}

/**
 * Cloudflare R2 storage provider (S3-compatible).
 * Uses @aws-sdk/client-s3 pointed at R2's endpoint.
 */
export class R2Provider implements StorageProvider {
  readonly id = 'r2';
  private client: S3Client;

  constructor(private config: R2Config) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async upload(input: UploadInput): Promise<UploadResult> {
    const body = await toBuffer(input.body);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        Body: body,
        ContentType: input.contentType,
      }),
    );

    const baseUrl = this.config.publicUrl.replace(/\/$/, '');
    return {
      url: `${baseUrl}/${input.key}`,
      key: input.key,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }
}

async function toBuffer(body: Uint8Array | Buffer | Blob | ArrayBuffer): Promise<Uint8Array> {
  if (body instanceof Uint8Array) return body;
  if (body instanceof ArrayBuffer) return new Uint8Array(body);
  // Blob (and File) have arrayBuffer()
  if (typeof (body as Blob).arrayBuffer === 'function') {
    const ab = await (body as Blob).arrayBuffer();
    return new Uint8Array(ab);
  }
  return body as unknown as Uint8Array;
}
