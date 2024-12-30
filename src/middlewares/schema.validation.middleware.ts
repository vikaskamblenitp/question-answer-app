import { ERROR_CODES } from "#constants";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";
import { isNonEmptyArray } from "@austinburns/type-guards";
import { logger } from "#helpers/index";

class ValidationMiddlewareError extends Error {
  status: StatusCodes;
  errorCode: ERROR_CODES;
	constructor(message: string, httpStatus: StatusCodes, errorCode: ERROR_CODES) {
		super(message);
		this.name = "ValidationMiddlewareError";
		this.status = httpStatus;
		this.errorCode = errorCode;
	}
}

export const validateTypedSchema = (schema: AnyZodObject): RequestHandler => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
			file: req.file,
			files: req.files
		});
		return next();
	} catch (error) {
		const typedError = error as ZodError;
		if (isNonEmptyArray(typedError?.issues)) {
			typedError.name = "InvalidSchemaError";
			logger.error(typedError);
      const message = typedError.issues.map((issue) => `${issue.path.join(".")}:${issue.message}`).join(", ");
			return next(new ValidationMiddlewareError(message, StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID));
		}

    return next(error);
	}
};
