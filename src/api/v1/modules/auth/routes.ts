import { Router } from "express";
import { controller as api } from "./controller";
import { methodNotAllowed, validateTypedSchema } from "#middlewares";
import { schema } from "./schema";

const router = Router();

router.route("/register").post(validateTypedSchema(schema.registerUser), api.registerUser).all(methodNotAllowed);
router.route("/login").post(validateTypedSchema(schema.loginUser), api.loginUser).all(methodNotAllowed);

export default router;