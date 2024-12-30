import { generateEmbeddings, getAIGeneratedAnswer, sqlQuery, sqlTransaction } from "#helpers";
import { localsUser } from "#types";
import { StatusCodes } from "http-status-codes";
import { QaApiError } from "./error";
import { AnswerSchemaInput, GetAllQuestionAnswersParams, GetAllQuestionAnswersQuery } from "./schema";
import { ERROR_CODES } from "#constants";

class QA {
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
  async getAllQuestionAnswers(params: GetAllQuestionAnswersParams, queryParams: GetAllQuestionAnswersQuery, userInfo: localsUser): Promise<{ records: Record<string, string>[]}> {
    const { fileID } = params;

    const { limit, offset } = queryParams;
    
    // NOTE: no need to check if the file exist for user because the following query will return empty array as records
    const query = `SELECT question, answer FROM data_qas
      INNER JOIN data_files ON data_files.id = data_qas.file_id
      LEFT JOIN data_users ON data_users.id = data_files.uploaded_by
      WHERE file_id = $1 AND uploaded_by = $2
      LIMIT $3 OFFSET $4`;

    const { rows } = await sqlQuery({ sql: query, values: [fileID, userInfo.user_id, limit, offset] });

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
  async answerQuestion(payload: AnswerSchemaInput, userInfo: localsUser) {
    const { question } = payload.body;

    const { fileID } = payload.params;

    const userID = userInfo.user_id;

    // check file exist or not for the user
    await this._checkFileExistsForUser(fileID, userID);

    // generate embeddings for question
    const questionEmbeddings = await generateEmbeddings(question);

    // store embeddings in data_qas table
    const insertQuestionQuery = `INSERT INTO data_qas (question, embeddings, file_id, created_by) VALUES ('${question}', ARRAY[${questionEmbeddings}], '${fileID}', '${userID}') returning id`;

    // get most relevant context from data_files embeddings
    const getMostRelevantContextQuery = `SELECT content, embeddings, embeddings <#> ARRAY[${questionEmbeddings}]::vector as similarity FROM data_file_embeddings
    WHERE file_id = $1 ORDER BY embeddings <#> ARRAY[${questionEmbeddings}]::vector LIMIT 5`;

    const [insertQuestionResult, getMostRelevantContextResult] = await sqlTransaction([insertQuestionQuery, getMostRelevantContextQuery], [[], [fileID]]);

    // format the context
    const context = getMostRelevantContextResult.rows.map((row: any) => row.content).join("\n");

    // get answer from model
    const aiAnswer = await getAIGeneratedAnswer(context, question);

    // store anser to DB
    const insertAnswerQuery = `UPDATE data_qas SET answer = $1 WHERE id = $2`;
    await sqlQuery({ sql: insertAnswerQuery, values: [aiAnswer, insertQuestionResult.rows[0].id] });

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

export const qa = new QA();