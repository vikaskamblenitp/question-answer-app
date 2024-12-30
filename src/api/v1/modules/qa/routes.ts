import { Router } from "express";
import { controller as api } from "./controller.js";
import { methodNotAllowed, validateTypedSchema } from "#middlewares";
import { answerSchema } from "./schema.js";

const router = Router();

router.get("/qas", api.getQuestionAnswers);

router.route("/qa/file/:fileID/answer").post(validateTypedSchema(answerSchema), api.answerQuestion).all(methodNotAllowed);

export default router;