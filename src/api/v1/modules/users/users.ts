import { sqlQuery } from "#helpers";
import { generateJwtToken } from "#utils";
import { RegisterUserSchema } from "./schema";

class Users {
  /**
   * @description This function is used to register a new user
   * @param {object} body : The body of the request
   * @param {string} body.first_name : The first name of the user
   * @param {string} body.last_name : The last name of the user
   * @param {string} body.email : The email of the user
   * @returns 
   * @deprecated We don't use this function anymore. This is just for demonstration purposes
   */
  async registerUser(body: RegisterUserSchema) {
    const insertUserQuery = `INSERT INTO data_users(first_name, last_name, email) VALUES($1, $2, $3) RETURNING *`;

    const { rows } = await sqlQuery({ sql: insertUserQuery, values: [body.first_name, body.last_name, body.email] });

    return { user_id: rows[0].id };
  }

  /**
   * @description This function is used to login a user
   * @param {object} body : The body of the request
   * @param {string} body.email : The email of the user
   * @returns 
   * @deprecated We don't use this function anymore. This is just for demonstration purposes
   */
  async loginUser(body: { email: string }) {
    const selectUserQuery = `SELECT id, first_name, last_name, email FROM data_users WHERE email = $1`;

    const { rows } = await sqlQuery({ sql: selectUserQuery, values: [body.email] });
    const { id, first_name, last_name, email } = rows[0];
    const accessToken = generateJwtToken({ user_id: id, first_name, last_name, email });

    return { id, first_name, last_name, email, access_token: accessToken };
  }
}

export const users = new Users();