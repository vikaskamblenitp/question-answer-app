import { ERROR_CODES } from "#constants";
import { StatusCodes } from "http-status-codes";

class UsersApiError extends Error {
  status: StatusCodes;
  errorCode: ERROR_CODES;
  constructor(message: string, httpStatus: StatusCodes, errorCode: ERROR_CODES) {
    super(message);
    this.name = "UsersApiError";
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export { UsersApiError };