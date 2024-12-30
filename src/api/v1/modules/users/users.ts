import { sqlQuery } from "#helpers";
import { RegisterUserSchema } from "./schema";

class Users {
  async registerUser(body: RegisterUserSchema) {
    const insertUserQuery = `INSERT INTO data_users(first_name, last_name, email) VALUES($1, $2, $3) RETURNING *`;

    const { rows } = await sqlQuery({ sql: insertUserQuery, values: [body.first_name, body.last_name, body.email] });

    return { user_id: rows[0].id };
  }
}

export const users = new Users();