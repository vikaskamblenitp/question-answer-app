import { envConfig } from "#configs";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {  } from "langchain/chat_models/universal";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { logger } from "./logger";

const embeddings = new OpenAIEmbeddings({ apiKey: envConfig.OPENAI_API_KEY, model: "text-embedding-ada-002" });

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // Maximum size of each chunk
  chunkOverlap: 50, // Overlap between chunks to maintain context
});

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  openAIApiKey: envConfig.OPENAI_API_KEY
});

export const generateChunkEmbeddings = async (fileContent: string): Promise<Array<{ content: string, embeddings: number[] }>> => {

  const chunks = await textSplitter.createDocuments([fileContent]);

  // generate embeddings
  const embeddingsData = await Promise.all(chunks.map(async (chunk) => {
    const embedData = await embeddings.embedQuery(chunk.pageContent);
    return { content: chunk.pageContent, embeddings: embedData };
  }));

  return embeddingsData;
}

export const generateEmbeddings = async (fileContent: string): Promise<number[]> => {
  const embeddingsData = await embeddings.embedQuery(fileContent);
  return embeddingsData;
}

export const getAIGeneratedAnswer = async (context: string, question: string) => {
  const prompt = PromptTemplate.fromTemplate(`
    Context Information:
    ${context}
    
    Question: ${question}
    
    Instructions:
    - If relevant information is present in the context, provide a precise and concise answer based strictly on the given context.
    - If NO relevant information is found in the context, respond ONLY with: "Sorry, I am not able to answer this question."
    - Do NOT generate an answer from your own knowledge if the context doesn't contain relevant information.
    `);

  // Create a chain with the prompt, model, and output parser
  const chain = prompt
    .pipe(model)
    .pipe(new StringOutputParser());

  try {
    // If context is empty or null, directly return the fallback message
    if (!context || context.trim() === '') {
      return "Sorry, I am not able to answer this question.";
    }

    // Generate the answer
    const result = await chain.invoke({
      context,
      question
    });

    return result;
  } catch (error) {
    logger.error(`Error generating answer: ${JSON.stringify(error)}`);
    return "Sorry, I am not able to answer this question.";
  }
}