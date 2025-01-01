import { ERROR_CODES, RATE_LIMIT_CONFIG } from "#constants";
import { redis } from "#helpers";
import { localsUser } from "#types";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RateLimitMiddlewareError extends Error {
  status: StatusCodes;
  errorCode: ERROR_CODES;
  constructor(message: string, status: StatusCodes, errorCode: ERROR_CODES) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

const setInitialTokenBucket = async (userID: string) => {
  // tokens: RATE_LIMIT_CONFIG.MAX_TOKENS - 1. Because we are using the first call
  await redis.hsetMultiple(`rl:${userID}`, { timestamp: Math.floor(Date.now() / 1000), tokens: RATE_LIMIT_CONFIG.MAX_TOKENS - 1 });
}

/**
 * @description Rate limiter using Token Bucket Algorithm
 */
export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = res.locals.user as localsUser;
  const userID = userInfo.user_id;

  const tokenBucketInfo = await redis.hgetall(`rl:${userID}`);
  if (!tokenBucketInfo) {
    await setInitialTokenBucket(userID);
    return next();
  }

  const { timestamp, tokens } = tokenBucketInfo;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const window = parseInt(timestamp as string) + RATE_LIMIT_CONFIG.WINDOW_SIZE_IN_SECONDS;

  // request hit inside the window
  if (window >= currentTimestamp) {
    // check for tokens
    if (parseInt(tokens as string) > 0) {
      // decrease the token count
      // DECRBY is not available in redis for hash so need to use INCRBY with -1
      await redis.hincrby(`rl:${userID}`, "tokens", -1);

      return next();
    }

    // throw rate limit error
    return next(new RateLimitMiddlewareError(`You have exceeded the ${RATE_LIMIT_CONFIG.MAX_TOKENS} requests in ${Math.ceil(RATE_LIMIT_CONFIG.WINDOW_SIZE_IN_SECONDS/60)} minutes limit. Please try again later in ${window - currentTimestamp} seconds`, StatusCodes.TOO_MANY_REQUESTS, ERROR_CODES.NOT_ALLOWED));
  }

  // If the window is already passed then reset the tokens and timestamp
  await setInitialTokenBucket(userID);
  return next(); 
};
