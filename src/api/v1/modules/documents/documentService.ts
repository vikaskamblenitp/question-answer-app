import { BUCKETS, ERROR_CODES, EVENTS, QUEUES } from "#constants";
import { logger } from "#helpers";
import BullQueue from "#helpers/bull-queue";
import { minioClient } from "#helpers/minio";
import { Express } from "express";
import { paramsDocumentIDType, queryGetDocumentsType } from "./schema";
import { localsUser } from "#types";
import { DocumentsApiError } from "./error";
import { StatusCodes } from "http-status-codes";
import { DocumentRepository } from "./documentRepository";
import { IDocument } from "./types";

class DocumentService {
  private documentRepository: DocumentRepository;

  constructor() {
    this.documentRepository = new DocumentRepository();
  }

  /**
   * @description Function to upload pdf file and extract embeddings on which q&a can be performed latter
   * @param file : pdf file of which embeddings are to be generated
   * @returns 
   */
  async uploadFile(file: Express.Multer.File, userInfo: localsUser) {
    const userID = userInfo.user_id;

    const { buffer, mimetype, ...rest } = file;

    // upload file to minio
    const data = await minioClient.uploadFile(BUCKETS.DOCUMENT, file.originalname, buffer);

    // save file details
    const document = await this.documentRepository.insertFile(file.originalname, userID, { ...rest, ...data });

    // schedule job for processing the document for embeddings
    const documentQueue = new BullQueue(QUEUES.DOCUMENTS);

    const job = await documentQueue.addJob(EVENTS.GENERATE_EMBEDDINGS, { 
      file: document.id, 
      name: file.originalname, 
      file_buffer: buffer,
      mime_type: mimetype
    }, { jobId: document.id, removeOnComplete: true, removeOnFail: false });

    logger.info(`Job scheduled for processing the pdf file with job id: ${job.id}`);
    
    return { file: { id: document.id }, message: "File uploaded successfully" };
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

    const documents = await this.documentRepository.getDocuments(limit, offset, filter, sort)

    return { records: documents };
  }

  /**
   * @param documentID : id of the file
   * @returns {Object} details of the file
   */
  async getFileDetails({ documentID }: paramsDocumentIDType): Promise<IDocument> {
    const document = await this.documentRepository.documentById(documentID);

    if (!document) {
      throw new DocumentsApiError(`File not found`, StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return document;
  }

  /**
   * @description Function to download pdf file
   * @param {string} fileID : id of the file
   * @returns stream of the file
   */
  async downloadFile({ documentID }: paramsDocumentIDType) {
    const document = await this.getFileDetails({ documentID });

    const fileName = document.name;
    const data = await minioClient.getFile(BUCKETS.DOCUMENT, fileName);
    return data;
  }
}

export const documentService = new DocumentService();
