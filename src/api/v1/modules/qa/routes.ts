import { Router } from "express";
import { controller as api } from "./controller.js";
import { methodNotAllowed, validateTypedSchema, validateUser } from "#middlewares";
import { schema } from "./schema.js";

const router = Router();

router.route("/file/:fileID").get(validateUser, api.getAllQuestionAnswers).all(methodNotAllowed);

router.route("/file/:fileID/answer").post(validateUser, validateTypedSchema(schema.answerSchema), api.answerQuestion).all(methodNotAllowed);

export default router;