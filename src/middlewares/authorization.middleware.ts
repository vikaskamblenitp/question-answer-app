import { ERROR_CODES } from "#constants";
import { verifyJwtToken } from "#utils";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class AuthorizationMiddlewareError extends Error {
  status: StatusCodes;
  errorCode: ERROR_CODES;
  constructor(message: string, status: StatusCodes, errorCode: ERROR_CODES) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;  
  }
}

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.startsWith("Bearer"))) {
    return next(new AuthorizationMiddlewareError(`Authorization header missing or invalid`, StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHENTICATED));
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new AuthorizationMiddlewareError(`Token missing`, StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHENTICATED));
  }

  const decodedData = verifyJwtToken(token);

  res.locals.user = decodedData as Record<string, any>;

  next();
}