import app from "../../app";

import { IRepository } from "../base.repository";
import { List } from "./list.model";

export class ListRepository implements IRepository {

  async findAll(filter: any): Promise<List[]> {
    app.log.debug(`ListRepository :: findAll() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {

      var query_string: string = `SELECT * FROM lists`;

      if (filter.hasOwnProperty('board_id')) {
        query_string = query_string.concat(` WHERE board_id=${filter["board_id"]}`)
      }

      const { rows } = await client.query(query_string)
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`ListRepository :: findAll() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async count(filter: any): Promise<any> {
    app.log.debug(`ListRepository :: count() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM lists')
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`ListRepository :: count() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows[0]);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async findById(id: string): Promise<List | null> {
    app.log.debug(`ListRepository :: findById() :: id :: ${id}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM lists WHERE id=$1', [id])
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`ListRepository :: findById() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const list: any = rows[0];
        const listRetorno: List = new List(
          list.name, 
          list.board_id,
          list.position
        );

        app.log.debug(`ListRepository :: findById() :: listRetorno :: ${JSON.stringify(listRetorno)}`,);

        return Promise.resolve(listRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async create(entity: List): Promise<any> {

    return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const list = await client.query(
            'INSERT INTO public.lists(id, name, board_id, position) VALUES(nextval(\'lists_id_seq\'::regclass), $1, $2, $3) RETURNING id, name, board_id, position', 
            [entity.name, entity.board_id, entity.position]
        )
    
        app.log.debug(`ListRepository :: create() :: list :: ${JSON.stringify(list.rows[0])}`);

        return Promise.resolve(list.rows[0]);
    });
  }

  async update(entity: Partial<List>): Promise<any> {
    app.log.debug(`ListRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const list = await client.query(
            'UPDATE lists SET name=$2, board_id=$3, position=$4 WHERE id=$1 RETURNING id, name, board_id, position', 
            [entity.id, entity.name, entity.board_id, entity.position]
        )
        
        app.log.debug(`ListRepository :: update() :: list :: ${JSON.stringify(list.rows[0])}`,);

        return Promise.resolve(list.rows[0]);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async patch(entity: Partial<List>): Promise<any> {
    app.log.debug(`ListRepository :: patch() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    var query_string: string = "UPDATE lists SET ";

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
        const list = await client.query(query_string);
        
        app.log.debug(`ListRepository :: patch() :: list :: ${JSON.stringify(list)}`,);
        return Promise.resolve(list);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async delete(id: string): Promise<any> {
    const client = await app.pg.connect();

    try {
      const deleted_cards = await client.query(`DELETE FROM cards WHERE list_id=${id}`);
      const deleted_lists = await client.query(`DELETE FROM lists WHERE id=${id}`);

      app.log.debug(`ListRepository :: delete() :: deleted cards :: ${deleted_cards.rows.length}`);

      return Promise.resolve(deleted_lists);
    } catch (error) {
      return Promise.resolve(error)
    }
  }

}
