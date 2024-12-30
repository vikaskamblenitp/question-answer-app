import * as Minio from 'minio'
import { logger } from './logger';
import { BUCKETS } from '#constants';
import { envConfig } from '#configs';

class MinioClient {
  private client: Minio.Client

  constructor() {
    this.client = new Minio.Client({
      endPoint: envConfig.MINIO_ENDPOINT as string,
      port: envConfig.MINIO_PORT,
      useSSL: true,
      accessKey: envConfig.MINIO_ACCESS_KEY as string,
      secretKey: envConfig.MINIO_SECRET_KEY as string,
    });
  }

  async init() {
    // TODO: Update logic if you want to create multiple buckets
    await this.createBucket(BUCKETS.DOCUMENT);
  }

  async createBucket(bucketName: string) {
    const exists = await this.client.bucketExists(bucketName);
    if (exists) {
      logger.info(`Bucket ${bucketName} exists.`);
    } else {
      await this.client.makeBucket(bucketName, 'us-east-1');
      logger.info(`Bucket ${bucketName} created.`);
    }
  }

  async uploadFile(bucketName: string, name: string, fileBuffer: Buffer) {
    const fileData = await this.client.putObject(bucketName, name, fileBuffer);
    return fileData;
  }

  async getFile(bucketName: string, fileName: string) {
    const dataStream = await this.client.getObject(bucketName, fileName);
    return dataStream;
  }

  getAllObjects(bucketName: string) {
    const data = this.client.listObjects(bucketName);
    return data;
  }
}

export const minioClient = new MinioClient();