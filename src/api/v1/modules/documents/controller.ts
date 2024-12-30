import { catchAsync } from "#utils";
import { Request, Response, Express } from "express";
import { documents } from "./documents.js";
import { paramsDocumentIDType } from "./schema.js";

export const controller = {
  uploadFile: catchAsync(async (req: Request, res: Response) => {
    const response = await documents.uploadFile(req.file as Express.Multer.File, res.locals.user);
    res.jsend.success(response);
  }),

  getDocuments: catchAsync(async (req: Request, res: Response) => {
    const response = await documents.getDocuments(req.query, res.locals.user);
    res.jsend.success(response);
  }),

  getFileDetails: catchAsync(async (req: Request, res: Response) => {
    const response = await documents.getFileDetails(req.params as paramsDocumentIDType);
    res.jsend.success(response);
  }),

  downloadFile: catchAsync(async (req: Request, res: Response) => {
    const response = await documents.downloadFile(req.params as paramsDocumentIDType);
    res.setHeader("Content-Type", "application/pdf");
    response.pipe(res);
  }),
};
