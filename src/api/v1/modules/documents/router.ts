import { Router } from "express";
import { controller as api } from "./controller";
import { externalUploadMiddleware, methodNotAllowed, rateLimiter, validateTypedSchema, validateUser } from "#middlewares";
import { schema } from "./schema";

const router = Router();

router.route("/documents")
  .post(validateUser, externalUploadMiddleware("file"), validateTypedSchema(schema.uploadFileSchema), rateLimiter, api.uploadFile)
  .get(validateUser, validateTypedSchema(schema.getDocumentsSchema), api.getDocuments)
  .all(methodNotAllowed);

router.route("/documents/:documentID")
  .get(validateUser, validateTypedSchema(schema.getFileDetailsSchema), api.getFileDetails)
  .all(methodNotAllowed);
  
router.route("/documents/:documentID/download")
  .post(validateUser, validateTypedSchema(schema.downloadFileSchema), api.downloadFile)
  .all(methodNotAllowed);

export default router;
