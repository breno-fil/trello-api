import { config } from "dotenv";
import app from "../../app";
import { User } from "./user.model";
import { UserRepository } from "./user.repository";

config();

export class UserService {
  private readonly userRepository = new UserRepository();

  public async findAll(filter: any): Promise<User[]> {
    try {
      app.log.debug(`UserService :: findAll() :: inicio`);

      let users = await this.userRepository.findAll(filter);

      app.log.debug(
        `UserService :: findAll() :: users :: users.length :: ${users.length}`,
      );

      return Promise.resolve(users);
    } catch (error) {
      app.log.error(`UserService :: findAll() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async count(filter: any): Promise<any> {
    try {
      app.log.debug(`UserService :: count()`);

      let count = await this.userRepository.count(filter);

      app.log.debug(`UserService :: count() :: ${JSON.stringify(count)}`);

      return Promise.resolve(count);
    } catch (error) {
      app.log.error(`UserService :: count() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      app.log.debug(`UserService :: findById() :: id :: ${id}`);

      let user = await this.userRepository.findById(id);

      app.log.debug(
        `UserService :: findById() :: user :: ${JSON.stringify(user)}`,
      );

      return Promise.resolve(user);
    } catch (error) {
      app.log.error(`UserService :: findById() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async create(user: User): Promise<any> {
    try {
      app.log.debug(`UserService :: create()`);

      let result = await this.userRepository.create(user);

      app.log.debug(
        `UserService :: create() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`UserService :: create() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async login(user: User): Promise<any> {
    try {
      app.log.debug(`UserService :: login() :: ${JSON.stringify(user)}`);

      let loggedUser = await this.userRepository.login(user);

      app.log.debug(
        `UserService :: login() :: user :: ${JSON.stringify(loggedUser)}`,
      );

      return Promise.resolve(loggedUser);
    } catch (error) {
      app.log.error(`UserService :: login() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async update(user: Partial<User>): Promise<any> {
    try {
      app.log.debug(`UserService :: update()`);

      let result = await this.userRepository.update(user);

      app.log.debug(
        `UserService :: update() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`UserService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async patch(user: Partial<User>): Promise<any> {
    try {
      app.log.debug(`UserService :: update()`);

      let result = await this.userRepository.patch(user);

      const row_count: number = result?.rowCount ?? 0;

      app.log.debug(`ROW COUNT :: ${row_count}`);

      if (row_count != 0) {
        const response_user = this.findById(String(user.id));
        app.log.debug(`UserService :: patch() :: result :: findById :: ${JSON.stringify(response_user)}`);
        return Promise.resolve(response_user);
      } else {
        app.log.debug(`UserService :: update() :: result :: ${JSON.stringify(result)}`);
        return Promise.resolve(result);
      }
    } catch (error) {
      app.log.error(`UserService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      app.log.debug(`UserService :: delete() :: id :: ${id}`);

      let result = await this.userRepository.delete(id);

      app.log.debug(
        `UserService :: delete() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`UserService :: delete() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async changePassword(user: Partial<User>): Promise<any> {
    try {
      app.log.debug(`UserService :: changePassword()`);
      let result = await this.userRepository.changePassword(user);
      app.log.debug(`UserService :: changePassword() :: result :: ${JSON.stringify(result)}`);
      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`UserService :: changePassword() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findByToken(token: string): Promise<User | null> {
    try {
      app.log.debug(
        `UserService :: findByToken() :: token to find :: ${token}`,
      );
      let user = await this.userRepository.findByToken(token);
      app.log.debug(
        `UserService :: findByToken() :: user :: ${JSON.stringify(user)}`,
      );
      return Promise.resolve(user);
    } catch (error) {
      app.log.error(`UserService :: findByToken() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

}
