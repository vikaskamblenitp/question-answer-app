import { generateEmbeddings, getAIGeneratedAnswer, sqlQuery } from "#helpers";
import { localsUser } from "#types";
import { AnswerSchemaInput } from "./schema";

class QA {
  async getQuestionAnswers() {
    await new Promise((resolve) => { resolve("Answer") });
  }

  async answerQuestion(payload: AnswerSchemaInput, userInfo: localsUser) {
    const { question } = payload.body;

    const { fileID } = payload.params;

    const userID = userInfo.user_id;

    // generate embeddings for question
    const questionEmbeddings = await generateEmbeddings(question);
    // store embeddings in data_qas table
    const insertQuestionQuery = `INSERT INTO data_qas (question, embeddings, file_id, created_by) VALUES ('${question}', ARRAY[${questionEmbeddings}], '${fileID}', '${userID}') returning id`;
    const insertQuestionResult =  await sqlQuery({ sql: insertQuestionQuery });

    // get most relevant context from data_files embeddings
    const getMostRelevantContextQuery = `SELECT content, embeddings, embeddings <#> ARRAY[${questionEmbeddings}]::vector as similarity FROM data_file_embeddings
    WHERE file_id = $1 ORDER BY embeddings <#> ARRAY[${questionEmbeddings}]::vector LIMIT 5`;
    const { rows } = await sqlQuery({ sql: getMostRelevantContextQuery, values: [fileID] });

    // format the context
    const context = rows.map((row: any) => row.content).join("\n");

    // get answer from model
    const aiAnswer = await getAIGeneratedAnswer(context, question);

    // store anser to DB
    const insertAnswerQuery = `UPDATE data_qas SET answer = $1 WHERE id = $2`;
    await sqlQuery({ sql: insertAnswerQuery, values: [aiAnswer, insertQuestionResult.rows[0].id] });

    return { question, answer: aiAnswer };
  }
};

export const qa = new QA();