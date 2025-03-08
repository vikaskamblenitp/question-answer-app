import { catchAsync } from "#utils";
import { Request, Response } from "express";
import { userService } from "./userService";

export const controller = {
  registerUser: catchAsync(async (req: Request, res: Response) => {
    const response = await userService.registerUser(req.body);
    res.jsend.success(response, "User registered successfully");
  }),

  loginUser: catchAsync(async (req: Request, res: Response) => {
    const response = await userService.loginUser(req.body);
    res.jsend.success(response, "User login successful");
  })
}
