import { Router } from "express";
import { controller as api } from "./controller.js";
import { methodNotAllowed, rateLimiter, validateTypedSchema, validateUser } from "#middlewares";
import { schema } from "./schema.js";

const router = Router();

router.route("/file/:fileID/history").get(validateUser, api.getAllQuestionAnswers).all(methodNotAllowed);

router.route("/file/:fileID/ask").post(validateUser, validateTypedSchema(schema.questionSchema), rateLimiter, api.answerQuestion).all(methodNotAllowed);

export default router;