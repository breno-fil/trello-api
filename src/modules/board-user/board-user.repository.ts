import app from "../../app";
import { BoardUser } from "./board-user.model";
import { IRepository } from "../base.repository";

export class BoardUserRepository implements IRepository {

  async findAll(entity: Partial<BoardUser>): Promise<BoardUser[]> {
    app.log.debug(`BoardUserRepository :: findAll() :: entity :: ${JSON.stringify(entity)}`,);

    var query_string: string = "SELECT * FROM board_users";

    var entries: any[] = Object.entries(entity);

    if (entries.length > 0) query_string = query_string.concat(' WHERE ');

    entries.forEach((entry: any, index: number) => {
      app.log.debug(`BoardUserRepository :: findAll() :: entries :: ${entry}`);

      const type = typeof entry[1]

      if (type == 'string') {
        query_string = query_string.concat(`${entry[0]}='${entry[1]}'`)
      } else {
        query_string = query_string.concat(`${entry[0]}=${entry[1]}`)
      }

      query_string = (index < (entries.length - 1)) ? query_string.concat(' AND ') : query_string.concat('');
    });

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query(query_string)
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardUserRepository :: findAll() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async count(filter: any): Promise<any> {
    app.log.debug(`BoardUserRepository :: count() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT COUNT(*) FROM board_users')
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardUserRepository :: count() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows[0]);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async findById(id: string): Promise<BoardUser | null> {
    app.log.debug(`BoardUserRepository :: findById() :: id :: ${id}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM boards WHERE id=$1', [id])
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`BoardUserRepository :: findById() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const board: any = rows[0];
        const boardRetorno: BoardUser = new BoardUser(
          board.name, 
          board.background_color, 
          board.text_color,
          board.created_by
        );

        app.log.debug(`BoardUserRepository :: findById() :: boardRetorno :: ${JSON.stringify(boardRetorno)}`,);

        return Promise.resolve(boardRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async create(entity: BoardUser): Promise<any> {

    return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error        
        const board_user = await client.query(
          'INSERT INTO board_users(board_id, user_id, role, starred) VALUES($1, $2, $3, $4)',
          [entity.board_id, entity.user_id, entity.role, entity.starred]
        );
        app.log.debug(`BoardUserRepository :: create() :: id :: ${JSON.stringify(board_user.rows[0])}`);

        const board_id: number = board_user.rows[0]['id'];

        app.log.debug(`BoardUserRepository :: create board_user :: ${JSON.stringify(board_user)}`);

        return Promise.resolve(board_user.rows[0]);
    });
  }

  async update(entity: Partial<BoardUser>): Promise<any> {
    app.log.debug(`BoardUserRepository :: update() :: boardUser :: ${JSON.stringify(entity)}`,);

    const client = await app.pg.connect();

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const boardUser = await client.query(
            'UPDATE board_users SET role=$3, starred=$4 WHERE board_id=$1 AND user_id=$2', 
            [entity.board_id, entity.user_id, entity.role, entity.starred]
        )
        
        app.log.debug(`BoardUserRepository :: update() :: boardUser :: ${JSON.stringify(boardUser)}`,);
        return Promise.resolve(entity);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async patch(entity: Partial<BoardUser>): Promise<any> {
    app.log.debug(`BoardUserRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    var query_string: string = "UPDATE board_users SET ";

    var entries: any[] = Object.entries(entity);

    entries.forEach((entry: any[], index: number) => {
      const type = typeof entry[1];

      query_string = (type == 'string') ? query_string.concat(`${entry[0]}='${entry[1]}'`) : query_string.concat(`${entry[0]}=${entry[1]}`);

      query_string = (index < (entries.length - 1)) ? query_string.concat(', ') : query_string.concat(' ');
    });

    query_string = query_string.concat(`WHERE board_id=${entity.board_id}, user_id=${entity.user_id}`);

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const board = await client.query(query_string)
        
        app.log.debug(`BoardUserRepository :: patch() :: boardUser :: ${JSON.stringify(board)}`,);
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
      const deleted = await client.query('DELETE FROM boards WHERE id=$1', [id])
      return Promise.resolve(deleted)
    } catch (error) {
      return Promise.resolve(error)
    }
  }

}
