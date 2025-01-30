import app from "../../app";
import { User } from "./user.model";
import { IRepository } from "../base.repository";

export class UserRepository implements IRepository {

  async findAll(filter: any): Promise<User[]> {
    app.log.debug(`UserRepository :: findAll() :: filter :: ${filter}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM users')
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`UserRepository :: findAll() :: rows :: ${JSON.stringify(rows)}`,);
      return Promise.resolve(rows);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async count(filter: any): Promise<any> {
    return Promise.resolve([{ count: 0 }]);
  }

  async findById(id: string): Promise<User | null> {
    app.log.debug(`UserRepository :: findById() :: id :: ${id}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE id=$1', [id])
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`UserRepository :: findById() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const user: any = rows[0];
        const userRetorno: User = new User(
          user.id,
          user.username,
          user.email
        );

        app.log.debug(`UserRepository :: findById() :: userRetorno :: ${JSON.stringify(userRetorno)}`,);

        return Promise.resolve(userRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async create(entity: User): Promise<any> {
    app.log.debug(`UserRepository :: findById() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    try {

      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const user = await client.query(
          'INSERT INTO users(id, username, email, password) VALUES(nextval(\'users_id_seq\'::regclass), $1, $2, $3) RETURNING id, username, email, password',
          [entity.username, entity.email, entity.password]
        )
        
        var responseUser = user.rows[0];

        responseUser.token = app.jwt.sign({
          id: responseUser.id,
          username: responseUser.username,
          email: responseUser.email
        });

        const { updatedUser } = await client.query(
          "UPDATE users SET token=$1 WHERE id=$2;",
          [responseUser.token, responseUser.id]
        )

        app.log.debug(`UserRepository :: create() :: user :: ${JSON.stringify(responseUser)}`,);

        return Promise.resolve(responseUser);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async update(entity: Partial<User>): Promise<any> {
    app.log.debug(`UserRepository :: update() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const user = await client.query(
          'UPDATE users SET username=$2, email=$3, password=$4, token=$5 WHERE id=$1',
          [entity.id, entity.username, entity.email, entity.password, entity.token]
        )

        app.log.debug(`UserRepository :: create() :: id :: ${JSON.stringify(user)}`,);
        return Promise.resolve(user);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async patch(entity: Partial<User>): Promise<any> {
    app.log.debug(`UserRepository :: patch() :: user :: ${entity}`,);

    const client = await app.pg.connect();

    var query_string: string = "UPDATE users SET ";

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
        const user = await client.query(query_string);
        app.log.debug(`UserRepository :: patch() :: id :: ${JSON.stringify(user)}`,);
        return Promise.resolve(user);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async delete(id: string): Promise<any> {
    return Promise.resolve({});
  }

  async changePassword(entity: Partial<User>): Promise<any> {
    const client = await app.pg.connect();
    try {
      return app.pg.transact(async client => {
        // will resolve to an id, or reject with an error
        const user = await client.query(
          'UPDATE users SET password=$2 WHERE id=$1',
          [entity.id, entity.newPassword]
        );
        app.log.debug(`UserRepository :: patch() :: id :: ${JSON.stringify(user)}`,);
        return Promise.resolve(user);
      });
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }

  }

  async login(user: Partial<User>): Promise<User | null> {

    app.log.debug(`UserRepository :: login() :: email :: ${user.email}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query(
        'SELECT * FROM users WHERE email=$1 and password=$2',
        [user.email, user.password]
      )
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`UserRepository :: login() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const user: any = rows[0];
        const userRetorno: User = new User(
          user.id,
          user.username,
          user.email,
          user.password
        );

        userRetorno.token = app.jwt.sign({
          id: user.id,
          username: user.username,
          email: user.email
        });

        const { updatedUser } = await client.query(
          "UPDATE users SET token=$1 WHERE id=$2;",
          [userRetorno.token, userRetorno.id]
        )

        app.log.debug(`UserRepository :: login() :: updatedUser :: ${JSON.stringify(updatedUser)}`,);

        app.log.debug(`UserRepository :: login() :: userRetorno :: ${JSON.stringify(userRetorno)}`,);

        return Promise.resolve(userRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }

  async findByToken(token: string): Promise<User | null> {
    app.log.debug(`UserRepository :: findByToken() :: token :: ${token}`,);

    const client = await app.pg.connect();

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE token=$1', [token]);
      // Note: avoid doing expensive computation here, this will block releasing the client
      // return rows
      app.log.debug(`UserRepository :: findByToken() :: rows :: ${JSON.stringify(rows)}`,);

      if (rows.length > 0) {
        const user: any = rows[0];
        const userRetorno: User = new User(
          user.id,
          user.username,
          user.email
        );

        app.log.debug(`UserRepository :: findByToken() :: userRetorno :: ${JSON.stringify(userRetorno)}`,);

        return Promise.resolve(userRetorno);
      } else {
        return Promise.resolve(null);
      }
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  }
}
