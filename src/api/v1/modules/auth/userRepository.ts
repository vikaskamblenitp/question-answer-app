import { db } from "#helpers";
import { RegisterUserSchema } from "./schema";

interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository {
  async createUser(data: RegisterUserSchema) {
    const result = await db.query<IUser>({
      sql: `INSERT INTO data_users(first_name, last_name, email) VALUES($1, $2, $3) RETURNING *`,
      values: [data.first_name, data.last_name, data.email],
    });

    return result[0];
  }

  async findByEmail(email: string) {
    const result = await db.query<IUser>({
      sql: `SELECT * FROM data_users WHERE email = $1`,
      values: [email],
    });

    return result[0];
  }
}
