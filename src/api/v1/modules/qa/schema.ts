import z from "zod";

export const schema = {
  getAllQuestionAnswers: z.object({
    params: z.object({
      fileID: z.string().uuid().nonempty()
    }).strict(),
    query: z.object({
      limit: z.number().default(10).optional(),
      offset: z.number().default(10).optional()
    })
  }),

  questionSchema: z.object({
    body: z.object({
      question: z.string().nonempty()
    }).strict(),
    params: z.object({
      fileID: z.string().uuid().nonempty()
    }).strict()
  })
}

export type QuestionSchemaInput = z.infer<typeof schema.questionSchema>;
export type GetAllQuestionAnswersParams = z.infer<typeof schema.getAllQuestionAnswers>["params"];
export type GetAllQuestionAnswersQuery = z.infer<typeof schema.getAllQuestionAnswers>["query"];
