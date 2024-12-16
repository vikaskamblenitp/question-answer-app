import * as Minio from 'minio'
import { logger } from './logger';
import { BUCKETS } from '#constants';

class MinioClient {
  private client: Minio.Client

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
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