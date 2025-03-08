import { db } from "#helpers";
import { IDocument } from "./types";

export class DocumentRepository {
  async insertFile(
    fileName: string,
    userID: string,
    metadata: Record<string, any>
  ) {
    const insertFileQuery = `INSERT INTO data_files(name, uploaded_by, metadata) VALUES($1, $2, $3) returning id`;
    const result = await db.query<{ id: string }>({
      sql: insertFileQuery,
      values: [fileName, userID, metadata],
    });

    return result[0];
  }

  async documentById(documentID: string) {
    const result = await db.query<IDocument>({
      sql: `SELECT * FROM data_files WHERE id = $1`,
      values: [documentID],
    });
    return result[0];
  }

  async getMatchedContent(fileID: string, questionEmbeddings: number[]) {
    const getMostRelevantContextQuery = `SELECT content, embeddings, embeddings <#> ARRAY[${questionEmbeddings}]::vector as similarity FROM data_file_embeddings
        WHERE file_id = $1 ORDER BY embeddings <#> ARRAY[${questionEmbeddings}]::vector LIMIT 5`;
    
    const result = await db.query<{ content: string }>({sql: getMostRelevantContextQuery, values: [fileID] });
    return result;
  }

  async getDocuments(limit: number, offset: number, filter: Record<string, any>, sort?: Record<string, "asc" | "desc">) {
    const queryValues = [limit, offset];

    let filterQuery = "";
    let sortQuery = "";

    if (filter) {
      filterQuery = `WHERE ${Object.keys(filter)
        .map((key, index) => {
          queryValues.push(filter[key]);
          return `${index ? "AND" : ""} ${key} = $${index + 3}`;
        })
        .join(" ")}`;
    }

    if (sort) {
      sortQuery = `ORDER BY ${Object.keys(sort)
        .map((key) => `df.${key} ${sort[key]}`)
        .join(", ")}`;
    }

    const getDocumentsQuery = `SELECT * FROM data_files df
      LEFT JOIN data_users du ON df.uploaded_by = du.id
     ${filterQuery} ${sortQuery} LIMIT $1 OFFSET $2`;

     const rows = await db.query<IDocument>({ sql: getDocumentsQuery, values: queryValues });
     return rows;
  }
}
