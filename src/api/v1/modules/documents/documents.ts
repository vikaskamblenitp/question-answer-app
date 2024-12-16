import { BUCKETS, EVENTS, QUEUES } from "#constants";
import { sqlQuery } from "#helpers";
import BullQueue from "#helpers/bull-queue";
import { minioClient } from "#helpers/minio";
import { Express } from "express";

class Documents {
  async uploadFile(file: Express.Multer.File) {
    const userID = "06cca4fa-fba8-408d-b274-e6e10d156041";
    const { buffer, ...rest } = file;

    const data = await minioClient.uploadFile(BUCKETS.DOCUMENT, file.originalname, buffer);

    const insertFileQuery = `INSERT INTO data_files(name, uploaded_by, metadata) VALUES($1, $2, $3) returning id`;

    const { rows } =await sqlQuery({ sql: insertFileQuery, values: [file.originalname, userID, { ...rest, ...data }] });

    const documentQueue = new BullQueue(QUEUES.DOCUMENTS);

    await documentQueue.addJob(EVENTS.GENERATE_EMBEDDINGS, { file: rows[0].id, name: file.originalname }, { jobId: rows[0].id, removeOnComplete: true, removeOnFail: false });
    
    return { file: data, message: "File uploaded successfully" };
  }

  async getFile(fileName: string) {
    const data = await minioClient.getFile(BUCKETS.DOCUMENT, fileName);
    return data;
  }
}

export const documents = new Documents();
