/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BUCKETS, EVENTS, QUEUES } from "#constants";
import { generateChunkEmbeddings, logger, sqlQuery } from "#helpers";
import BullQueue from "#helpers/bull-queue";
import { minioClient } from "#helpers/minio";
import { streamToString } from "#utils";
import { Job } from "bull";

const documentQueue = new BullQueue(QUEUES.DOCUMENTS);

export const initDocumentEmbeddingGenerator = () => {
  documentQueue.queue.process(EVENTS.GENERATE_EMBEDDINGS, async (job: Job) => {
    const { data } = job;
    try {
      logger.info(`Generating embeddings for document ${data.name}`);

      // get file content
      const fileStream = await minioClient.getFile(BUCKETS.DOCUMENT, data.name);
      const fileContent = await streamToString(fileStream);

      logger.info(fileContent);

      // generate embeddings
      const embeddingData = await generateChunkEmbeddings(fileContent);

      // update status data_files
      const updateFileQuery = `UPDATE data_files SET is_processed = $1 WHERE id = $2`;
      await sqlQuery({ sql: updateFileQuery, values: [true, job.id] });

      // insert embeddings
      let insertEmbeddingsQuery = `INSERT INTO data_file_embeddings(file_id, content, embeddings) VALUES`;
      embeddingData.forEach(({ content, embeddings }) => {
        insertEmbeddingsQuery += `('${job.id}', '${content}', ARRAY[${embeddings}]::vector),`;
      });

      insertEmbeddingsQuery = insertEmbeddingsQuery.slice(0, -1);

      await sqlQuery({ sql: insertEmbeddingsQuery });
      
      logger.info(`Processed document ${data.name}`);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  });
}