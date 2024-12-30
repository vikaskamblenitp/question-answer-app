import { catchAsync } from "#utils";
import { documents } from "./documents.js";

export const controller = {
  uploadFile: catchAsync(async (req: any, res: any) => {
    const response = await documents.uploadFile(req.file);
    res.jsend.success(response);
  }),

  getDocuments: catchAsync(async (req: any, res: any) => {
    const response = await documents.getDocuments(req.query);
    res.jsend.success(response);
  }),

  getFileDetails: catchAsync(async (req: any, res: any) => {
    const response = await documents.getFileDetails(req.params);
    res.jsend.success(response);
  }),

  downloadFile: catchAsync(async (req: any, res: any) => {
    const response = await documents.downloadFile(req.params);
    res.setHeader("Content-Type", "application/pdf");
    response.pipe(res);
  }),
};
