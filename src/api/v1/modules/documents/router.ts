import { Router } from "express";
import { controller as api } from "./controller";
import { externalUploadMiddleware, methodNotAllowed } from "#middlewares";

const router = Router();

router.route("/documents")
  .get(api.getFile)
  .post(externalUploadMiddleware("file"), api.uploadFile)
  .all(methodNotAllowed);

export default router;
