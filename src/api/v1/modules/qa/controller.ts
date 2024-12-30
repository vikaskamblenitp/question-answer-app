import { Request, Response } from "express";
import { catchAsync } from "#utils/index.js";
import { qa } from "./qa";
import { AnswerSchemaInput } from "./schema";

export const controller = {
  getQuestionAnswers: catchAsync(async (req: Request, res: Response) => {
    const response = await qa.getQuestionAnswers();
    res.jsend.success(response);
  }),

  answerQuestion: catchAsync(async (req: Request, res: Response) => {
    const { params, body } = req;
    const response = await qa.answerQuestion({ params, body } as AnswerSchemaInput, res.locals.user);
    res.jsend.success(response);
  })
}