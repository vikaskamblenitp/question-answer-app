import { EVENTS, QUEUES } from "#constants";
import { generateChunkEmbeddings, logger, sqlTransaction } from "#helpers";
import BullQueue from "#helpers/bull-queue";
import { convertPdfToBase64, extractTextFromImage, sanitizeText } from "#utils";
import { Job } from "bull";

const documentQueue = new BullQueue(QUEUES.DOCUMENTS);

// TODO: move this to documents.ts
const processFileAndGenerateEmbeddings = async (job) => {
  const { data } = job;
  try {
    logger.info(`Generating embeddings for document ${data.name}`);

    // get file buffer
    const { file_buffer: fileBufferData, mime_type: mimeType } = data;

    const fileBuffer = Buffer.isBuffer(fileBufferData) ? Buffer.from(fileBufferData) : Buffer.from(fileBufferData.data as Buffer);
    
    let imageBuffers: Buffer[];
    if (mimeType === "application/pdf") {
      // get file content
      const base64Pages = await convertPdfToBase64(fileBuffer);
      logger.info(`Converted PDF to base64 with ${base64Pages.length} pages`);
      imageBuffers = base64Pages.map(page => Buffer.from(page, "base64"));
    }  else if (mimeType.startsWith("image/")) {
      imageBuffers = [fileBuffer];
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // get file content
    const fileContent = await extractTextFromImage(imageBuffers);

    const sanitizedContent = sanitizeText(fileContent);

    // generate embeddings
    const embeddingData = await generateChunkEmbeddings(sanitizedContent);

    // update status data_files
    const updateFileQuery = `UPDATE data_files SET is_processed = $1 WHERE id = $2`;

    // insert embeddings
    let insertEmbeddingsQuery = `INSERT INTO data_file_embeddings(file_id, content, embeddings) VALUES`;
    embeddingData.forEach(({ content, embeddings }) => {
      insertEmbeddingsQuery += ` ('${job.id}', '${content}', ARRAY[${embeddings}]::vector),`;
    });

    insertEmbeddingsQuery = insertEmbeddingsQuery.slice(0, -1);

    await sqlTransaction([updateFileQuery, insertEmbeddingsQuery],[[true, job.id], []]);
    
    logger.info(`Processed document ${data.name}`);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export const initDocumentEmbeddingGenerator = () => {
  documentQueue.queue.process(EVENTS.GENERATE_EMBEDDINGS, async (job: Job) => {
    await processFileAndGenerateEmbeddings(job);
  });
}
