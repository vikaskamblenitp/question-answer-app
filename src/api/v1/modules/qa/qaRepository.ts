import { db } from "#helpers";
import { IQuestionAnswer } from "./types";

export class QARepository {
  async insertQuestion(data: {
    question: string;
    questionEmbeddings: number[];
    fileID: string;
    userID: string;
  }) {
    const { question, questionEmbeddings, fileID, userID } = data;
    const insertQuestionQuery = `INSERT INTO data_qas (question, embeddings, file_id, created_by) VALUES ('${question}', ARRAY[${questionEmbeddings}], '${fileID}', '${userID}') returning id`;
    const result = await db.query<{ id: string }>({ sql: insertQuestionQuery });
    return result[0];
  }

  async updateQuestion(questionID: string, data: Partial<IQuestionAnswer>) {
    const keys = Object.keys(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const updateQuery = `UPDATE data_qas SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await db.query<IQuestionAnswer>({ sql: updateQuery, values: [questionID]});
    return result[0];
  }

  async saveAnswer(questionID: string, answer: string) {
    const insertAnswerQuery = `UPDATE data_qas SET answer = $1 WHERE id = $2`;
    await db.query({
      sql: insertAnswerQuery,
      values: [answer, questionID],
    });
  }

  async getQAs(
    fileID: string,
    userID: string,
    limit: number = 20,
    offset: number = 0
  ) {
    const getQAsQuery = `SELECT id, question, answer, updated_at FROM data_qas
      INNER JOIN data_files ON data_files.id = data_qas.file_id
      LEFT JOIN data_users ON data_users.id = data_files.uploaded_by
      WHERE file_id = $1 AND uploaded_by = $2
      LIMIT $3 OFFSET $4`;
    const result = await db.query<IQuestionAnswer>({
      sql: getQAsQuery,
      values: [fileID, userID, limit, offset],
    });

    return result;
  }
}
