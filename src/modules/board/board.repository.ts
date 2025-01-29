import app from "../../app";
import { Board } from "./board.model";
import { IRepository } from "../base.repository";

export class BoardRepository implements IRepository {

  async findAll(filter: any): Promise<Board[]> {
    app.log.debug(`BoardRepository :: findAll() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    var query_string: string = 'SELECT * FROM boards'

    if (filter.hasOwnProperty('user_id')) {
      query_string = query_string.concat(` WHERE created_by=${filter['user_id']}`);
    }

    try {
      const { rows } = await client.query(query_string)
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardRepository :: findAll() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async count(filter: any): Promise<any> {
    app.log.debug(`BoardRepository :: count() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM boards')
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardRepository :: count() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows[0]);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async findById(id: string): Promise<Board | null> {
    app.log.debug(`BoardRepository :: findById() :: id :: ${id}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM boards WHERE id=$1', [id])
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardRepository :: findById() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const board: any = rows[0];
        const boardRetorno: Board = new Board(
          board.name, 
          board.background_color, 
          board.text_color,
          board.created_by
        );

        app.log.debug(`BoardRepository :: findById() :: boardRetorno :: ${JSON.stringify(boardRetorno)}`,);

        return Promise.resolve(boardRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async create(entity: Board): Promise<any> {

    return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const result = await client.query(
          'INSERT INTO boards(id, name, background_color, text_color, created_by) VALUES(nextval(\'boards_id_seq\'::regclass), $1, $2, $3, $4) RETURNING id', 
          [entity.name, entity.background_color, entity.text_color, entity.created_by]
        )
        
        app.log.debug(`BoardRepository :: create() :: id :: ${JSON.stringify(result.rows[0])}`);

        const board_id: number = result.rows[0]['id'];

        const board_user = await client.query(
          'INSERT INTO board_users(board_id, user_id, role, starred) VALUES($1, $2, $3, $4)',
          [board_id, entity.created_by, 'owner', false]
        );

        app.log.debug(`BoardRepository :: create board_user :: ${JSON.stringify(board_user)}`);

        return Promise.resolve(result.rows[0]);
    });
  }

  async update(entity: Partial<Board>): Promise<any> {
    app.log.debug(`BoardRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const list = await client.query(
            'UPDATE lists SET name=$2, background_color=$3, text_color=$4, created_by=$5 WHERE id=$1', 
            [entity.id, entity.name, entity.background_color, entity.text_color, entity.created_by]
        )
        
        app.log.debug(`BoardRepository :: update() :: id :: ${JSON.stringify(list)}`,);
        return Promise.resolve(list);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async patch(entity: Partial<Board>): Promise<any> {
    app.log.debug(`BoardRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    var query_string: string = "UPDATE boards SET ";

    var entries: any[] = Object.entries(entity);

    entries.forEach((entry: any[], index: number) => {
      const type = typeof entry[1];

      if (type == 'string') {
        query_string = query_string.concat(`${entry[0]}='${entry[1]}'`);
      } else {
        query_string = query_string.concat(`${entry[0]}=${entry[1]}`);
      }

      query_string = (index < (entries.length - 1)) ? query_string.concat(', ') : query_string.concat(' ');
    });

    query_string = query_string.concat(`WHERE id=${entity.id}`);

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const board = await client.query(query_string)
        
        app.log.debug(`BoardRepository :: patch() :: board :: ${JSON.stringify(board)}`,);
        return Promise.resolve(board);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async delete(id: string): Promise<any> {
    const client = await app.pg.connect();

    try {
      const board = await client.query(`DELETE FROM boards WHERE id=${id}`);
      const board_users = await client.query(`DELETE FROM board_users WHERE board_id=${id}`);

      return Promise.resolve(board);
    } catch (error) {
      return Promise.resolve(error);
    }
  }

}
