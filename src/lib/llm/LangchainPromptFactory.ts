import { envConfig } from "#configs";
import { LLM_PROVIDERS } from "#constants";
import { logger } from "#helpers";
import { OpenAIChatModel } from "./OpenAIChatModel";
import { LangchainPromptProcessor } from "./PromptProcessor";

export class LangchainPromptFactory {
    static getPromptProcessor(provider: string) {
        switch (provider) {
            case LLM_PROVIDERS.OPENAI:
                return new LangchainPromptProcessor(new OpenAIChatModel("gpt-4o", envConfig.OPENAI_API_KEY || ""));
            case LLM_PROVIDERS.TOGETHERAI:
                return new LangchainPromptProcessor(new OpenAIChatModel("mistralai/Mixtral-8x7B-Instruct-v0.1", envConfig.TOGETHERAI_API_KEY || ""));
        
            default:
                logger.warn(`Wrong LLM provider: ${provider} OR it is yet to be integrated`);
                return new LangchainPromptProcessor(new OpenAIChatModel("gpt-4o", envConfig.OPENAI_API_KEY || ""));
        }
    }
}