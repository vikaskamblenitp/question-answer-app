import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class LangchainUtil {
    private static textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500, // Maximum size of each chunk
      chunkOverlap: 50, // Overlap between chunks to maintain context
    });

    static async splitText(fileContent: string) {
        const chunks = await LangchainUtil.textSplitter.createDocuments([fileContent]);
        return chunks;
    }

}