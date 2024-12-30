import z from "zod";
import { Express } from "express";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = {
	"application/pdf": ["pdf"],
}

export const schema = {
  uploadFileSchema: z.object({
    file: z.custom<Express.Multer.File>()
		.refine(file => !(file instanceof String), "File is required")
		.refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than 5mb.`)
		.refine(file => Object.keys(ACCEPTED_FILE_TYPES).includes(file.mimetype), "Only PDF and Image files are allowed"), // Expect a single file upload
  }),

  getDocumentsSchema: z.object({
    query: z.object({
      limit: z.number().int().positive().default(10),
      offset: z.number().int().positive().default(0),
      filter: z.object({
        name: z.string().optional(),
        is_processed: z.string().optional()
      }),
      sort: z.object({
        name: z.enum(["asc", "desc"]).optional(),
        created_at: z.enum(["asc", "desc"]).optional(),
      })
    }).partial()
  }),

  getFileDetailsSchema: z.object({
    params: z.object({
      documentID: z.string().uuid().nonempty(),
    }).strict()
  }),

  downloadFileSchema: z.object({
    params: z.object({
      documentID: z.string().uuid().nonempty(),
    }).strict()
  })
}


export type paramsDocumentIDType = z.infer<typeof schema.getFileDetailsSchema>["params"];

export type queryGetDocumentsType = z.infer<typeof schema.getDocumentsSchema>["query"];
