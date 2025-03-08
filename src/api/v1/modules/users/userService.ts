import { generateJwtToken } from "#utils";
import { UsersApiError } from "./error";
import { RegisterUserSchema } from "./schema";
import { ERROR_CODES } from "#constants";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "./userRepository";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * @description This function is used to register a new user
   * @param {object} body : The body of the request
   * @param {string} body.first_name : The first name of the user
   * @param {string} body.last_name : The last name of the user
   * @param {string} body.email : The email of the user
   * @returns
   */
  async registerUser(body: RegisterUserSchema) {
    const user = await this.userRepository.findByEmail(body.email);
    if (user) {
      throw new UsersApiError(`User already exist with this email`, StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INVALID);
    }
    const result = await this.userRepository.createUser(body);
    return { user_id: result.id };
  }

  /**
   * @description This function is used to login a user
   * @param {object} body : The body of the request
   * @param {string} body.email : The email of the user
   * @returns
   */
  async loginUser(body: { email: string }) {
    const user = await this.userRepository.findByEmail(body.email);
    if (!user) {
      throw new UsersApiError("User not found", StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const accessToken = generateJwtToken({ ...user, user_id: user.id });

    return { ...user, access_token: accessToken };
  }
}

export const userService = new UserService();