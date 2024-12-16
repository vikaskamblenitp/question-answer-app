import { Router } from "express";
import { controller as api } from "./controller.js";
import { methodNotAllowed } from "#middlewares";

const router = Router();

router.get("/qas", api.getQuestionAnswers);

router.route("/answer").post(api.answerQuestion).all(methodNotAllowed);

export default router;