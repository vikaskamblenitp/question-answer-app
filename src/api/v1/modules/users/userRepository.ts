import { sqlQuery } from "#helpers";
import { RegisterUserSchema } from "./schema";

export class UserRepository {
    async createUser(data: RegisterUserSchema) {
        const result = await sqlQuery({
            sql: `INSERT INTO data_users(first_name, last_name, email) VALUES($1, $2, $3) RETURNING *`,
            values: [...Object.values(data)]
        });

        return result.rows[0];
    }

    async findByEmail(email: string) {
        const result = await sqlQuery({
            sql: `SELECT * FROM data_users WHERE email = $1`,
            values: [email]
        });

        return result.rows[0];
    }
}