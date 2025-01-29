import { config } from "dotenv";
import app from "../../app";
import { BoardUser } from "./board-user.model";
import { BoardUserRepository } from "./board-user.repository";

config();

export class BoardUserService {
  private readonly boardUserRepository = new BoardUserRepository();

  public async findAll(filter: Partial<BoardUser>): Promise<BoardUser[]> {
    try {
      app.log.debug(`BoardUserService :: findAll() :: inicio :: ${JSON.stringify(filter)}`);

      let boardUsers = await this.boardUserRepository.findAll(filter);

      app.log.debug(`BoardUserService :: findAll() :: BoardUsers :: BoardUsers.length :: ${boardUsers.length}`);

      return Promise.resolve(boardUsers);
    } catch (error) {
      app.log.error(`BoardUserService :: findAll() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async count(filter: any): Promise<any> {
    try {
      app.log.debug(`BoardUserService :: count()`);

      let count = await this.boardUserRepository.count(filter);

      app.log.debug(`BoardUserService :: count() :: ${JSON.stringify(count)}`);

      return Promise.resolve(count);
    } catch (error) {
      app.log.error(`BoardUserService :: count() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findById(id: string): Promise<BoardUser | null> {
    try {
      app.log.debug(`BoardUserService :: findById() :: id :: ${id}`);

      let BoardUser = await this.boardUserRepository.findById(id);

      app.log.debug(`BoardUserService :: findById() :: BoardUser :: ${JSON.stringify(BoardUser)}`);

      return Promise.resolve(BoardUser);
    } catch (error) {
      app.log.error(`BoardUserService :: findById() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async create(BoardUser: BoardUser): Promise<any> {
    try {
      app.log.debug(`BoardUserService :: create()`);

      let result = await this.boardUserRepository.create(BoardUser);

      app.log.debug(`BoardUserService :: create() :: result :: ${JSON.stringify(result)}`,);

      const id: number = result;

      app.log.debug(`BoardUserService :: create() :: id :: ${JSON.stringify(result)}`,);

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`BoardUserService :: create() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async update(boardUser: Partial<BoardUser>): Promise<any> {
    try {
      app.log.debug(`BoardUserService :: update()`);

      let result = await this.boardUserRepository.update(boardUser);

      app.log.debug(`BoardUserService :: update() :: result :: ${JSON.stringify(result)}`);

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`BoardUserService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async patch(boardUser: Partial<BoardUser>): Promise<any> {
    try {
      app.log.debug(`BoardUserService :: patch()`);

      let result = await this.boardUserRepository.patch(boardUser);

      const row_count: number = result?.rowCount ?? 0;

      app.log.debug(`BoardUserService :: patch() :: result :: ${JSON.stringify(result)}`);

      if (row_count != 0) {
        const response_board = this.findById(String(boardUser.board_id))
        app.log.debug(`BoardUserService :: patch() :: result :: findById :: ${JSON.stringify(response_board)}`);
        return Promise.resolve(response_board)
      } else {
        app.log.debug(`BoardUserService :: patch() :: result :: ${JSON.stringify(result)}`);
        return Promise.resolve(boardUser)
      }
    } catch (error) {
      app.log.error(`BoardUserService :: patch() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      app.log.debug(`BoardUserService :: delete() :: id :: ${id}`);

      let result = await this.boardUserRepository.delete(id);

      app.log.debug(
        `BoardUserService :: delete() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`BoardUserService :: delete() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

}
