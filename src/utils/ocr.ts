import { logger } from "#helpers";
import { createWorker } from "tesseract.js";

// Extracts text from an image buffer using OCR
export const extractTextFromImage = async (imageBuffers: Buffer[]): Promise<string> => {
  const worker = await createWorker("eng", 1, {
    logger: m => logger.debug(m)
  });

  try {
    const textParts: string[] = [];

    for (let i = 0; i < imageBuffers.length; i++) {
      const { data } = await worker.recognize(imageBuffers[i]);
      textParts.push(data.text);
      logger.debug(`Processed page ${i + 1} with ${data.text.length} characters`);
    }

    return textParts.join(" ");
  } finally {
    await worker.terminate();
  }
};
