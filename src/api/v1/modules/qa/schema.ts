import z from "zod";

export const answerSchema = z.object({
  body: z.object({
    question: z.string().nonempty(),
  }).strict(),
  params: z.object({
    fileID: z.string().uuid().nonempty()
  }).strict()
});

export type AnswerSchemaInput = z.infer<typeof answerSchema>;

export const getQuestionAnswersSchema = z.object({
  query: z.object({
    question: z.string().nonempty()
  })
});