import { IChatModel } from "./IChatModel";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai"

export class TogetherAIChatModel implements IChatModel {
  private model: ChatTogetherAI;
  constructor(apiKey: string, modelName: string) {
    this.model = new ChatTogetherAI({
      model: modelName || "gpt-4o",
      temperature: 0,
      apiKey,
    });
  }

  getModel() {
    return this.model;
  }
}
