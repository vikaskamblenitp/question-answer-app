import { logger } from "#helpers";
import { fromBuffer } from "pdf2pic";

export const convertBase64ToBuffer = (base64: string): Buffer => {
  return Buffer.from(base64, "base64");
};

// Converts a PDF file buffer to a base64-encoded image string
export const convertPdfToBase64 = async (fileBuffer: Buffer): Promise<string[]> => {
  const options = {
    density: 300,
    format: "png",
    width: 2550,
    height: 3300
  };

  const convert = fromBuffer(fileBuffer, options);

  try {
    // Get the total number of pages
    const pageCount = (await convert.bulk(-1)).length;

    logger.info(`Converting ${pageCount} pages to base64`);

    const conversionResults = await Promise.all(Array.from({ length: pageCount }, (_, i) => convert(i + 1, { responseType: "base64" })));
    
    const base64Pages: string[] = conversionResults.reduce((acc, { base64 }) => {
      if (base64) {
        acc.push(base64);
      }
      return acc;
    }, [] as string[]);
    
    if (base64Pages.length === 0) {
      throw new Error("No pages were successfully converted");
    }

    return base64Pages;
  } catch (error) {
    logger.error(`Error converting PDF to base64: ${JSON.stringify(error)}`);
    throw error;
  }
}
