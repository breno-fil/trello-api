import app from "../../app";
import { IRepository } from "../base.repository";
import { Card } from "./card.model";

export class CardRepository implements IRepository {

  async findAll(filter: any): Promise<Card[]> {
    app.log.debug(`CardRepository :: findAll() :: filter :: ${JSON.stringify(filter)}`,);

    const client = await app.pg.connect();

    try {

      var query_string: string = "SELECT * FROM cards ";

      if (filter.hasOwnProperty('list_id')) {
        query_string = query_string.concat(` WHERE list_id=${filter['list_id']}`)
      }

      const { rows } = await client.query(query_string)
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`CardRepository :: findAll() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async count(filter: any): Promise<any> {
    app.log.debug(`CardRepository :: count() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM boards')
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`CardRepository :: count() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows[0]);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async findById(id: string): Promise<Card | null> {
    app.log.debug(`CardRepository :: findById() :: id :: ${id}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM cards WHERE id=$1', [id])
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`CardRepository :: findById() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const card: any = rows[0];
        const cardRetorno: Card = new Card(
          card.name, 
          card.list_id, 
          card.position,
          card.due_date,
          card.created_at,
          card.description
        );

        app.log.debug(`CardRepository :: findById() :: cardRetorno :: ${JSON.stringify(cardRetorno)}`,);

        return Promise.resolve(cardRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async create(entity: Card): Promise<any> {

    return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const id = await client.query(
            'INSERT INTO public.cards(id, name, list_id, position, due_date, created_at, description) VALUES(nextval(\'cards_id_seq\'::regclass), $1, $2, $3, $4, $5, $6) RETURNING id', 
            [entity.name, entity.list_id, entity.position, entity.due_date, entity.created_at, entity.description]
        )
    
        app.log.debug(`CardRepository :: create() :: id :: ${JSON.stringify(id)}`,);

        return Promise.resolve(id);
    });
  }

  async update(entity: Partial<Card>): Promise<any> {
    app.log.debug(`CardRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const list = await client.query(
            'UPDATE cards SET name=$2, list_id=$3, position=$4, due_date=$5, created_at=$6, description=$7 WHERE id=$1',
            [entity.id, entity.name, entity.list_id, entity.position, entity.due_date, entity.created_at, entity.description]
        )
        
        app.log.debug(`CardRepository :: update() :: id :: ${JSON.stringify(list)}`,);
        return Promise.resolve(list);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async patch(entity: Partial<Card>): Promise<any> {
    app.log.debug(`CardRepository :: patch() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    var query_string: string = "UPDATE cards SET ";

    var entries: any[] = Object.entries(entity);

    entries.forEach((entry: any, index: number) => {
      const type = typeof entry[1]

      if (type == 'string') {
        query_string = query_string.concat(`${entry[0]}='${entry[1]}'`)
      } else {
        query_string = query_string.concat(`${entry[0]}=${entry[1]}`)
      }

      query_string = (index < (entries.length - 1)) ? query_string.concat(', ') : query_string.concat(' ');
    });

    query_string = query_string.concat(`WHERE id=${entity.id}`);

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const card = await client.query(query_string);
        
        app.log.debug(`CardRepository :: patch() :: id :: ${JSON.stringify(card)}`,);
        return Promise.resolve(card);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async delete(id: string): Promise<any> {
    const client = await app.pg.connect();

    try {
      const deleted = await client.query('DELETE FROM cards WHERE id=$1', [id])
      return Promise.resolve(deleted)
    } catch (error) {
      return Promise.resolve(error)
    }
  }

}
