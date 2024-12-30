import { Router } from "express";
import { controller as api } from "./controller.js";
import { methodNotAllowed, validateTypedSchema, validateUser } from "#middlewares";
import { answerSchema } from "./schema.js";

const router = Router();

router.route("/qas").get(validateUser, api.getQuestionAnswers).all(methodNotAllowed);

router.route("/qa/file/:fileID/answer").post(validateUser, validateTypedSchema(answerSchema), api.answerQuestion).all(methodNotAllowed);

export default router;