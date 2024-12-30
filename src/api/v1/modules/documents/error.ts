import { ERROR_CODES } from "#constants";
import { StatusCodes } from "http-status-codes";

class DocumentsApiError extends Error {
  status: StatusCodes;
  errorCode: ERROR_CODES;
  constructor(message: string, httpStatus: StatusCodes, errorCode: ERROR_CODES) {
    super(message);
    this.name = "DocumentsApiError";
    this.status = httpStatus;
    this.errorCode = errorCode;
  }
}

export { DocumentsApiError };