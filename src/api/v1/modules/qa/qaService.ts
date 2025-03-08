import { generateEmbeddings, getAIGeneratedAnswer, sqlQuery, sqlTransaction } from "#helpers";
import { localsUser } from "#types";
import { StatusCodes } from "http-status-codes";
import { QaApiError } from "./error";
import { QuestionSchemaInput, GetAllQuestionAnswersParams, GetAllQuestionAnswersQuery } from "./schema";
import { ERROR_CODES } from "#constants";
import { QARepository } from "./qaRepository";
import { IQuestionAnswer } from "./types";

class QAService {
  private qaRepository: QARepository
  
  constructor() {
    this.qaRepository = new QARepository();
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
    const getMostRelevantContextQuery = `SELECT content, embeddings, embeddings <#> ARRAY[${questionEmbeddings}]::vector as similarity FROM data_file_embeddings
    WHERE file_id = $1 ORDER BY embeddings <#> ARRAY[${questionEmbeddings}]::vector LIMIT 5`;

    const [getMostRelevantContextResult] = await sqlTransaction([getMostRelevantContextQuery], [[fileID]]);

    // format the context
    const context = getMostRelevantContextResult.rows.map((row: any) => row.content).join("\n");

    // get answer from model
    const aiAnswer = await getAIGeneratedAnswer(context, question);

    // store anser to DB
    await this.qaRepository.saveAnswer(insertQuestionResult.id, aiAnswer)

    return { question, answer: aiAnswer };
  }

  async _checkFileExistsForUser(fileID: string, userID: string) {
    const query = `SELECT * FROM data_files WHERE id = $1 AND uploaded_by = $2`;
    const { rows } = await sqlQuery({ sql: query, values: [fileID, userID] });
    if (rows.length === 0) {
      throw new QaApiError("File not found for the user", StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID);
    }

    return rows[0];
  }
};

export const qaService = new QAService();