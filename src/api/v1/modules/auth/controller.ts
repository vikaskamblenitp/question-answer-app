import { catchAsync } from "#utils";
import { Request, Response } from "express";
import { authService } from "./authService";

export const controller = {
  registerUser: catchAsync(async (req: Request, res: Response) => {
    const response = await authService.registerUser(req.body);
    res.jsend.success(response, "User registered successfully");
  }),

  loginUser: catchAsync(async (req: Request, res: Response) => {
    const response = await authService.loginUser(req.body);
    res.jsend.success(response, "User login successful");
  })
}
