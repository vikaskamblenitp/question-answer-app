import jwt from "jsonwebtoken";
import { ERROR_CODES } from "#constants/index";
import { StatusCodes } from "http-status-codes";
import { envConfig } from "#configs";

const secretKey = envConfig.JWT_SECRET || "";

export const generateJwtToken = (data, expiresIn = "3h") => {
  const token = jwt.sign(data, secretKey, { expiresIn });
  return token;
};

export const verifyJwtToken = token => {
	try {
		const decodedData = jwt.verify(token, secretKey);
		return decodedData;
	} catch (err: any) {
		if (err.name === "TokenExpiredError") {
			err.message = "User Session Expired";
		}
		err.status = StatusCodes.UNAUTHORIZED;
		err.errorCode = ERROR_CODES.UNAUTHENTICATED;

		throw err;
	}
};
