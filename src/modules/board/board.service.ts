import { config } from "dotenv";
import app from "../../app";
import { Board } from "./board.model";
import { BoardRepository } from "./board.repository";

config();

export class BoardService {
  private readonly boardRepository = new BoardRepository();

  public async findAll(filter: any): Promise<Board[]> {
    try {
      app.log.debug(`BoardService :: findAll() :: inicio`);

      let Boards = await this.boardRepository.findAll(filter);

      app.log.debug(
        `BoardService :: findAll() :: Boards :: Boards.length :: ${Boards.length}`,
      );

      return Promise.resolve(Boards);
    } catch (error) {
      app.log.error(`BoardService :: findAll() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async count(filter: any): Promise<any> {
    try {
      app.log.debug(`BoardService :: count()`);

      let count = await this.boardRepository.count(filter);

      app.log.debug(`BoardService :: count() :: ${JSON.stringify(count)}`);

      return Promise.resolve(count);
    } catch (error) {
      app.log.error(`BoardService :: count() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findById(id: string): Promise<Board | null> {
    try {
      app.log.debug(`BoardService :: findById() :: id :: ${id}`);

      let board = await this.boardRepository.findById(id);

      app.log.debug(
        `BoardService :: findById() :: Board :: ${JSON.stringify(board)}`,
      );

      return Promise.resolve(board);
    } catch (error) {
      app.log.error(`BoardService :: findById() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async create(board: Board): Promise<any> {
    try {
      app.log.debug(`BoardService :: create()`);

      let result = await this.boardRepository.create(board);

      app.log.debug(`BoardService :: create() :: result :: ${JSON.stringify(result)}`,);

      const rows: number = result.rows[0];

      app.log.debug(`BoardService :: create() :: rows :: ${JSON.stringify(rows)}`,);

      return Promise.resolve(rows);
    } catch (error) {
      app.log.error(`BoardService :: create() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async update(Board: Partial<Board>): Promise<any> {
    try {
      app.log.debug(`BoardService :: update()`);

      let result = await this.boardRepository.update(Board);

      app.log.debug(
        `BoardService :: update() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`BoardService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      app.log.debug(`BoardService :: delete() :: id :: ${id}`);

      let result = await this.boardRepository.delete(id);

      app.log.debug(
        `BoardService :: delete() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`BoardService :: delete() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

}
