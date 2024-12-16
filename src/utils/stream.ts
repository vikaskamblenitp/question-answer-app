import { Readable } from "stream";
import { extractTextFromPdf } from "./pdf";

export function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const dataBuffer: Buffer[] = [];

    stream.on("data", (chunk: Buffer) => {
      dataBuffer.push(chunk);
    });

    stream.on("end", async () => {
      const text = await extractTextFromPdf(Buffer.concat(dataBuffer));
      resolve(text as string);
    });

    stream.on("error", (error) => {
      reject(error);
    })
  })
}