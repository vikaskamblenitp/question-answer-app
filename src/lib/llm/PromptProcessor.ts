import { PromptTemplate } from "@langchain/core/prompts";
import { IChatModel } from "./IChatModel";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class LangchainPromptProcessor {
    private chatModel: IChatModel;

    constructor(chatModel: IChatModel) {
        this.chatModel = chatModel;
    }

    async generateAnswer({ question, context, template }: { question: string, context: string, template: string }): Promise<string> {
        const model = this.chatModel.getModel();
        const prompt = PromptTemplate.fromTemplate(template);
        const chat = prompt.pipe(model).pipe(new StringOutputParser());
        const result = await chat.invoke({
            context,
            question
        });
        return result;
    }
}