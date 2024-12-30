import { Router } from "express";
import { controller as api } from "./controller";
import { externalUploadMiddleware, methodNotAllowed, validateTypedSchema } from "#middlewares";
import { schema } from "./schema";

const router = Router();

router.route("/documents")
  .post(externalUploadMiddleware("file"), validateTypedSchema(schema.uploadFileSchema), api.uploadFile)
  .get(validateTypedSchema(schema.getDocumentsSchema), api.getDocuments)
  .all(methodNotAllowed);

router.route("/documents/:documentID")
  .get(validateTypedSchema(schema.getFileDetailsSchema), api.getFileDetails)
  .all(methodNotAllowed);
  
router.route("/documents/:documentID/download")
  .post(validateTypedSchema(schema.downloadFileSchema), api.downloadFile)
  .all(methodNotAllowed);

export default router;
