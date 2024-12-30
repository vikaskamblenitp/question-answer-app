import { BUCKETS, ERROR_CODES, EVENTS, QUEUES } from "#constants";
import { logger, sqlQuery } from "#helpers";
import BullQueue from "#helpers/bull-queue";
import { minioClient } from "#helpers/minio";
import { Express } from "express";
import { paramsDocumentIDType, queryGetDocumentsType } from "./schema";
import { localsUser } from "#types";
import { DocumentsApiError } from "./error";
import { StatusCodes } from "http-status-codes";

class Documents {
  /**
   * @description Function to upload pdf file and extract embeddings on which q&a can be performed latter
   * @param file : pdf file of which embeddings are to be generated
   * @returns 
   */
  async uploadFile(file: Express.Multer.File, userInfo: localsUser) {
    const userID = userInfo.user_id;
    const { buffer, ...rest } = file;

    const data = await minioClient.uploadFile(BUCKETS.DOCUMENT, file.originalname, buffer);

    const insertFileQuery = `INSERT INTO data_files(name, uploaded_by, metadata) VALUES($1, $2, $3) returning id`;

    const { rows } =await sqlQuery({ sql: insertFileQuery, values: [file.originalname, userID, { ...rest, ...data }] });

    const documentQueue = new BullQueue(QUEUES.DOCUMENTS);

    const job = await documentQueue.addJob(EVENTS.GENERATE_EMBEDDINGS, { file: rows[0].id, name: file.originalname }, { jobId: rows[0].id, removeOnComplete: true, removeOnFail: false });

    logger.info(`Job scheduled for processing the pdf file with job id: ${job.id}`);
    
    return { file: data, message: "File uploaded successfully" };
  }

  /**
   * @description Function to get list of documents
   * @param query : query parameters for filtering and sorting
   * @returns 
   */
  async getDocuments(query: queryGetDocumentsType, userInfo: localsUser) {
    const { limit = 10, offset = 0, sort } = query;

    const filter = {
      ...query.filter,
      uploaded_by: userInfo.user_id
    };

    const queryValues = [limit, offset];

    let filterQuery = "";
    let sortQuery = "";

     if (filter) {
      filterQuery = `WHERE ${Object.keys(filter).map((key, index) => {
        queryValues.push(filter[key]);
        return `${index ? 'AND' : ''} ${key} = $${index+3}`;
     }).join(" ")}`;
     }

     if (sort) {
      sortQuery = `ORDER BY ${Object.keys(sort).map(key => `df.${key} ${sort[key]}`).join(", ")}`;
     }

     const getDocumentsQuery = `SELECT * FROM data_files df
      LEFT JOIN data_users du ON df.uploaded_by = du.id
     ${filterQuery} ${sortQuery} LIMIT $1 OFFSET $2`;

    const { rows } = await sqlQuery({ sql: getDocumentsQuery, values: queryValues });

    return { records: rows };
  }

  /**
   * @param documentID : id of the file
   * @returns {Object} details of the file
   */
  async getFileDetails(documentID: paramsDocumentIDType): Promise<Record<string, any>> {
    const getFilenameResult = await sqlQuery({ sql: `SELECT * FROM data_files WHERE id = $1`, values: [documentID] });

    if (getFilenameResult.rows.length === 0) {
      throw new DocumentsApiError(`File not found`, StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return getFilenameResult.rows[0];
  }

  /**
   * @description Function to download pdf file
   * @param {string} fileID : id of the file
   * @returns stream of the file
   */
  async downloadFile(fileID: paramsDocumentIDType) {
    const getFilenameResult = await sqlQuery({ sql: `SELECT name FROM data_files WHERE id = $1`, values: [fileID] });

    if (getFilenameResult.rows.length === 0) {
      throw new Error(`File not found`);
    }

    const fileName = getFilenameResult.rows[0].name;
    const data = await minioClient.getFile(BUCKETS.DOCUMENT, fileName);
    return data;
  }
}

export const documents = new Documents();
