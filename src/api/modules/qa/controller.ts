import { Request, Response } from "express";
import { catchAsync } from "#utils/index.js";
import { qa } from "./qa";

export const controller = {
  getQuestionAnswers: catchAsync(async (req: Request, res: Response) => {
    const response = await qa.getQuestionAnswers();
    res.jsend.success(response);
  })
}