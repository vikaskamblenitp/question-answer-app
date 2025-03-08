import { generateEmbeddings, getAIGeneratedAnswer } from "#helpers";
import { localsUser } from "#types";
import { StatusCodes } from "http-status-codes";
import { QaApiError } from "./error";
import { QuestionSchemaInput, GetAllQuestionAnswersParams, GetAllQuestionAnswersQuery } from "./schema";
import { ERROR_CODES } from "#constants";
import { QARepository } from "./qaRepository";
import { IQuestionAnswer } from "./types";
import { DocumentRepository } from "../documents/documentRepository";

class QAService {
  private qaRepository: QARepository;
  private documentRepository: DocumentRepository;
  
  constructor() {
    this.qaRepository = new QARepository();
    this.documentRepository = new DocumentRepository();
  }

  /**
   * @description API to get all question answers asked for the file
   * @param {GetAllQuestionAnswersParams} params : params of the request
   * @param {string} params.fileID : file id
   * @param {GetAllQuestionAnswersQuery} queryParams : query params of the request
   * @param {number} queryParams.limit : limit of the query
   * @param {number} queryParams.offset : offset of the query
   * @param userInfo 
   * @returns 
   */
  async getAllQuestionAnswers(params: GetAllQuestionAnswersParams, queryParams: GetAllQuestionAnswersQuery, userInfo: localsUser): Promise<{ records: IQuestionAnswer[]}> {
    const { fileID } = params;

    // TODO: we should update it the pagination logic by accepting the page no
    const { limit, offset } = queryParams;
    
    // NOTE: no need to check if the file exist for user because the following query will return empty array as records
    const rows = await this.qaRepository.getQAs(fileID, userInfo.user_id, limit, offset);
    
    // TODO: Ideally we should also pass total count and current page
    return {
      records: rows
    };
  }

  /**
   * @description API to answer a question
   * @param payload 
   * @param {string} payload.params.fileID : file id on which question is asked
   * @param {string} payload.body.question : question asked
   * @param userInfo 
   * @returns 
   */
  async answerQuestion(payload: QuestionSchemaInput, userInfo: localsUser) {
    const { question } = payload.body; 
    const { fileID } = payload.params;

    const userID = userInfo.user_id;

    // check file exist or not for the user
    const file = await this._checkFileExistsForUser(fileID, userID);

    if (!file.is_processed) {
      throw new QaApiError("File is not processed yet", StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID);
    }

    // TODO: save the question first then update the embeddings of the question

    // generate embeddings for question
    const questionEmbeddings = await generateEmbeddings(question);

    // store the question & embeddings in data_qas table
    const insertQuestionResult = await this.qaRepository.insertQuestion({
      question,
      questionEmbeddings,
      fileID,
      userID
    })


    // get most relevant context from data_files embeddings
    const getMostRelevantContextResult = await this.documentRepository.getMatchedContent(fileID, questionEmbeddings);

    // format the context
    const context = getMostRelevantContextResult.map((row: any) => row.content).join("\n");

    // get answer from model
    const aiAnswer = await getAIGeneratedAnswer(context, question);

    // store anser to DB
    await this.qaRepository.saveAnswer(insertQuestionResult.id, aiAnswer)

    return { question, answer: aiAnswer };
  }

  async _checkFileExistsForUser(fileID: string, userID: string) {
    const document = await this.documentRepository.documentById(fileID);
    if (!document || (document && document.uploaded_by !== userID)) {
      throw new QaApiError("File not found for the user", StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID);
    }

    return document;
  }
};

export const qaService = new QAService();