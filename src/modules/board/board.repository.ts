import app from "../../app";
import { Board } from "./board.model";
import { IRepository } from "../base.repository";

export class BoardRepository implements IRepository {

  async findAll(filter: any): Promise<Board[]> {
    app.log.debug(`BoardRepository :: findAll() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM boards')
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
        const id = await client.query(
          'INSERT INTO public.boards(id, name, background_color, text_color, created_by) VALUES(nextval(\'boards_id_seq\'::regclass), $1, $2, $3, $4) RETURNING id', 
          [entity.name, entity.background_color, entity.text_color, entity.created_by]
        )
    
        app.log.debug(`BoardRepository :: create() :: id :: ${JSON.stringify(id)}`,);

        return Promise.resolve(id);
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
