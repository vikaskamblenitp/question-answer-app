import { catchAsync } from "#utils";
import { Request, Response, Express } from "express";
import { documentService } from "./documentService.js";
import { paramsDocumentIDType } from "./schema.js";

export const controller = {
  uploadFile: catchAsync(async (req: Request, res: Response) => {
    const response = await documentService.uploadFile(req.file as Express.Multer.File, res.locals.user);
    res.jsend.success(response);
  }),

  getDocuments: catchAsync(async (req: Request, res: Response) => {
    const response = await documentService.getDocuments(req.query, res.locals.user);
    res.jsend.success(response);
  }),

  getFileDetails: catchAsync(async (req: Request, res: Response) => {
    const response = await documentService.getFileDetails(req.params as paramsDocumentIDType);
    res.jsend.success(response);
  }),

  downloadFile: catchAsync(async (req: Request, res: Response) => {
    const response = await documentService.downloadFile(req.params as paramsDocumentIDType);
    res.setHeader("Content-Type", "application/pdf");
    response.pipe(res);
  }),
};
