import app from "../../app";
import { config } from "dotenv";
import { List } from "./list.model";
import { ListRepository } from "./list.repository";

config();

export class ListService {
  private readonly listRepository = new ListRepository();

  public async findAll(filter: any): Promise<List[]> {
    try {
      app.log.debug(`ListService :: findAll() :: inicio`);

      let Lists = await this.listRepository.findAll(filter);

      app.log.debug(
        `ListService :: findAll() :: Lists :: Lists.length :: ${Lists.length}`,
      );

      return Promise.resolve(Lists);
    } catch (error) {
      app.log.error(`ListService :: findAll() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async count(filter: any): Promise<any> {
    try {
      app.log.debug(`ListService :: count()`);

      let count = await this.listRepository.count(filter);

      app.log.debug(`ListService :: count() :: ${JSON.stringify(count)}`);

      return Promise.resolve(count);
    } catch (error) {
      app.log.error(`ListService :: count() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findById(id: string): Promise<List | null> {
    try {
      app.log.debug(`ListService :: findById() :: id :: ${id}`);

      let board = await this.listRepository.findById(id);

      app.log.debug(`ListService :: findById() :: List :: ${JSON.stringify(board)}`);

      return Promise.resolve(board);
    } catch (error) {
      app.log.error(`ListService :: findById() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async create(list: List): Promise<any> {
    try {
      app.log.debug(`ListService :: create() :: list :: ${JSON.stringify({list})}`);

      let result = await this.listRepository.create(list);

      app.log.debug(`ListService :: create() :: result :: ${JSON.stringify(list)}`);

      return Promise.resolve(list);
    } catch (error) {
      app.log.error(`ListService :: create() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async update(List: Partial<List>): Promise<any> {
    try {
      app.log.debug(`ListService :: update()`);

      let result = await this.listRepository.update(List);

      app.log.debug(
        `ListService :: update() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`ListService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async patch(list: Partial<List>): Promise<any> {
    try {
      app.log.debug(`ListService :: patch()`);

      let result = await this.listRepository.patch(list);

      const row_count: number = result?.rowCount ?? 0;

      app.log.debug(`ROW COUNT :: ${row_count}`);

      if (row_count != 0) {
        const response_list = this.findById(String(list.id));
        app.log.debug(`ListService :: patch() :: result :: findById :: ${JSON.stringify(response_list)}`);
        return Promise.resolve(response_list);
      } else {
        app.log.debug(`ListService :: patch() :: result :: ${JSON.stringify(result)}`);
        return Promise.resolve(list);
      }


    } catch (error) {
      app.log.error(`ListService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      app.log.debug(`ListService :: delete() :: id :: ${id}`);

      let result = await this.listRepository.delete(id);

      app.log.debug(
        `ListService :: delete() :: result :: ${JSON.stringify(result)}`,
      );

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`ListService :: delete() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

}
