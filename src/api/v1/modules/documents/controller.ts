import { catchAsync } from "#utils";
import { documents } from "./documents.js";

export const controller = {
  uploadFile: catchAsync(async (req: any, res: any) => {
    const response = await documents.uploadFile(req.file);
    res.jsend.success(response);
  }),

  getFile: catchAsync(async (req: any, res: any) => {
    const response = await documents.getFile(req.query.fileName);
    res.setHeader("Content-Type", "application/pdf");
    response.pipe(res);
  }),
};
