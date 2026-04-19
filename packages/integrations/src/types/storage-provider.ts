export interface UploadInput {
  /** Raw bytes. Can be a Uint8Array, Buffer, or Blob-like */
  body: Uint8Array | Buffer | Blob | ArrayBuffer;
  /** Target object key/path within the bucket (e.g. "products/abc123/image.jpg") */
  key: string;
  /** MIME type (e.g. "image/jpeg") */
  contentType?: string;
}

export interface UploadResult {
  /** Publicly accessible URL for the uploaded object */
  url: string;
  /** Storage-provider-specific key for later deletion */
  key: string;
}

export interface StorageProvider {
  /** The provider id (e.g. "r2", "s3", "cloudinary") */
  readonly id: string;

  /** Upload a single file */
  upload(input: UploadInput): Promise<UploadResult>;

  /** Delete a file by its key */
  delete(key: string): Promise<void>;
}
