import jwt from "jsonwebtoken";
import { ERROR_CODES } from "#constants/index";
import { StatusCodes } from "http-status-codes";
import { envConfig } from "#configs";

export class JwtUtil {
	private static secretKey = envConfig.JWT_SECRET || "";

	static generateJwtToken(data: any, expiresIn = "3h") {
		const token = jwt.sign(data, JwtUtil.secretKey, { expiresIn });
		return token;
	};

	static verifyJwtToken(token: string) {
		try {
			const decodedData = jwt.verify(token, JwtUtil.secretKey);
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
}
