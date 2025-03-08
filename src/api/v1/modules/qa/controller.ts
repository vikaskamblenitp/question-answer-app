import { Request, Response } from "express";
import { catchAsync } from "#utils/index.js";
import { qaService } from "./qaService";
import { QuestionSchemaInput } from "./schema";

export const controller = {
  getAllQuestionAnswers: catchAsync(async (req: Request, res: Response) => {
    const response = await qaService.getAllQuestionAnswers(req.params as any, req.query as any, res.locals.user);
    res.jsend.success(response);
  }),

  answerQuestion: catchAsync(async (req: Request, res: Response) => {
    const { params, body } = req;
    const response = await qaService.answerQuestion({ params, body } as QuestionSchemaInput, res.locals.user);
    res.jsend.success(response);
  })
}