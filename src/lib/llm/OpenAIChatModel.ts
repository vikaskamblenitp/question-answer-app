import { ChatOpenAI } from "@langchain/openai";
import { IChatModel } from "./IChatModel";

export class OpenAIChatModel implements IChatModel {
    private model: ChatOpenAI;
    constructor(apiKey: string, modelName: string) {
         this.model = new ChatOpenAI({
          model: modelName,
          temperature: 0,
          openAIApiKey: apiKey
        });
    }

    getModel() {
        return this.model;
    }
}