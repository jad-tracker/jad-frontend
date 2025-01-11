import {apiClient} from "./ApiClient";
import {convertError} from "./ApiError";
import {AxiosError} from "axios";

export interface User {
  token: string;
  expiresIn: number;
  expirationDate?: Date;
}

class UserService {
  private endpoint = "/users";

  public async login(username: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post(
        `${this.endpoint}/login`,
        {username, password}
      );

      return {
        ...response.data,
        expirationDate: new Date(Date.now() + response.data.expiresIn),
      };
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }

  public async register(username: string, password: string, confirmPassword: string): Promise<void> {
    try {
      await apiClient.post(
        `${this.endpoint}/register`,
        {username, password, confirmPassword}
      );
    } catch (error) {
      throw convertError(error as AxiosError | Error);
    }
  }
}

export const userService = new UserService();