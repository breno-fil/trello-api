import app from "../../app";
import { config } from "dotenv";
import { Card } from "./card.model";
import { CardRepository } from "./card.repository";

config();

export class CardService {
  private readonly cardRepository = new CardRepository();

  public async findAll(filter: any): Promise<Card[]> {
    try {
      app.log.debug(`CardService :: findAll() :: inicio`);

      let Cards = await this.cardRepository.findAll(filter);

      app.log.debug(
        `CardService :: findAll() :: Cards :: Cards.length :: ${Cards.length}`,
      );

      return Promise.resolve(Cards);
    } catch (error) {
      app.log.error(`CardService :: findAll() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async count(filter: any): Promise<any> {
    try {
      app.log.debug(`CardService :: count()`);

      let count = await this.cardRepository.count(filter);

      app.log.debug(`CardService :: count() :: ${JSON.stringify(count)}`);

      return Promise.resolve(count);
    } catch (error) {
      app.log.error(`CardService :: count() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async findById(id: string): Promise<Card | null> {
    try {
      app.log.debug(`CardService :: findById() :: id :: ${id}`);

      let card = await this.cardRepository.findById(id);

      app.log.debug(
        `CardService :: findById() :: Card :: ${JSON.stringify(card)}`,
      );

      return Promise.resolve(card);
    } catch (error) {
      app.log.error(`CardService :: findById() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async create(list: Card): Promise<any> {
    try {
      app.log.debug(`CardService :: create() :: list :: ${JSON.stringify(list)}`);

      let result = await this.cardRepository.create(list);

      app.log.debug(`CardService :: create() :: result :: ${JSON.stringify(result)}`);

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`CardService :: create() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async update(card: Partial<Card>): Promise<any> {
    try {
      app.log.debug(`CardService :: update()`);

      let result = await this.cardRepository.update(card);

      app.log.debug(`CardService :: update() :: result :: ${JSON.stringify(result)}`);

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`CardService :: update() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async patch(card: Partial<Card>): Promise<any> {
    try {
      app.log.debug(`CardService :: patch()`);

      let result = await this.cardRepository.patch(card);

      const row_count: number = result?.rowCount ?? 0;

      app.log.debug(`ROW COUNT :: ${row_count}`);

      if (row_count != 0) {
        const response_card = this.findById(String(card.id));
        app.log.debug(`CardService :: patch() :: result :: findById :: ${JSON.stringify(response_card)}`);
        return Promise.resolve(response_card);
      } else {
        app.log.debug(`CardService :: patch() :: result :: ${JSON.stringify(result)}`);
        return Promise.resolve(card)
      }
    } catch (error) {
      app.log.error(`CardService :: patch() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      app.log.debug(`CardService :: delete() :: id :: ${id}`);

      let result = await this.cardRepository.delete(id);
      app.log.debug(`CardService :: delete() :: result :: ${JSON.stringify(result)}`);

      return Promise.resolve(result);
    } catch (error) {
      app.log.error(`CardService :: delete() :: error :: ${error}`);
      return Promise.reject(error);
    }
  }

}
