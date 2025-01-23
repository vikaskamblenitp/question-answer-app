import { Router } from "express";
import { controller as api } from "./controller";
import { externalUploadMiddleware, methodNotAllowed, rateLimiter, validateTypedSchema, validateUser } from "#middlewares";
import { schema } from "./schema";

const router = Router();

router.route("/")
  .post(validateUser, externalUploadMiddleware("file"), validateTypedSchema(schema.uploadFileSchema), rateLimiter, api.uploadFile)
  .get(validateUser, validateTypedSchema(schema.getDocumentsSchema), api.getDocuments)
  .all(methodNotAllowed);

router.route("/:documentID")
  .get(validateUser, validateTypedSchema(schema.getFileDetailsSchema), api.getFileDetails)
  .all(methodNotAllowed);
  
router.route("/:documentID/download")
  .post(validateUser, validateTypedSchema(schema.downloadFileSchema), api.downloadFile)
  .all(methodNotAllowed);

export default router;
