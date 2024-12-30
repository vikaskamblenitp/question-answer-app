import { catchAsync } from "#utils";
import { Request, Response } from "express";
import { users } from "./users";

export const controller = {
  registerUser: catchAsync(async (req: Request, res: Response) => {
    const response = await users.registerUser(req.body);
    res.jsend.success(response, "User registered successfully");
  }),

  loginUser: catchAsync(async (req: Request, res: Response) => {
    const response = await users.loginUser(req.body);
    res.jsend.success(response, "User login successful");
  })
}
