import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { User } from "./user.model";
import { UserService } from "./user.service";

config();

const optsGETALL = {
  schema: {
    description: "Get All Users from the Sanitation platform.",
    summary: "Get All Users.",
    tags: ["User"],
    querystring: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "number",
          description: "limit number of results",
        },
        skip: {
          type: "number",
          description: "skip number of results for pagination",
        },
      },
    },
    response: {
      200: {
        description: "Array of Users from the Sanitation platform",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
          },
        },
        example: [
          {
            id: "string",
            username: "string",
            email: "string",
          },
        ],
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsRegisterPOST = {
  schema: {
    description: "Register a User in the Sanitation platform.",
    summary: "Register a User.",
    tags: ["User"],
    body: {
      type: "object",
      properties: {
        username: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    },
    response: {
      200: {
        description: "User registered at the Sanitation platform",
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          insertedId: { type: "string" },
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsLoginPOST = {
  schema: {
    description: "Login the User in the Sanitation platform.",
    summary: "Login the User.",
    tags: ["User"],
    body: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
    },
    response: {
      200: {
        description: "User registered at the Sanitation platform",
        type: "object",
        properties: {
          token: { type: "string" }
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsGETCOUNT = {
  schema: {
    description: "Get the total of Users from the Sanitation platform.",
    summary: "Get count of Users.",
    tags: ["User"],
    response: {
      200: {
        description: "Count of the Users from the Sanitation platform",
        type: "object",
        properties: {
          count: { type: "number" },
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsGETONE = {
  schema: {
    description: "Get a User of Sanitation platform.",
    summary: "Get one User.",
    tags: ["User"],
    response: {
      200: {
        description: "User from the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "string" },
          nome: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
          telefone: { type: "string" },
        },
        example: {
          id: "string",
          nome: "string",
          email: "string",
          role: "string",
          telefone: "string",
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsPUT = {
  schema: {
    description: "Update a User in the Sanitation platform.",
    summary: "Update a User.",
    tags: ["User"],
    body: {
      type: "object",
      properties: {
        nome: { type: "string" },
        telefone: { type: "string" },
        password: { type: "string" },
        newPassword: { type: "string" },
      },
    },
    response: {
      200: {
        description: "User updated at the Sanitation platform",
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          modifiedCount: { type: "number" },
          upsertedId: { type: "string" },
          upsertedCount: { type: "number" },
          matchedCount: { type: "number" },
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsDELETE = {
  schema: {
    description: "Delete a User of Sanitation platform.",
    summary: "Delete one User.",
    tags: ["User"],
    response: {
      200: {
        description: "User deleted at the Sanitation platform",
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          deletedCount: { type: "number" },
        },
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const userService = new UserService();

export default fastifyPlugin(async (app: FastifyInstance) => {

  /**
   * Route to find all users of the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/users",
    schema: optsGETALL.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: findAll()`);

      let { nome, limit, role, skip } = request.query;

      app.log.debug(
        `UserRoute :: handleRequest :: findAll() :: nome => ${nome}`,
      );
      app.log.debug(
        `UserRoute :: handleRequest :: findAll() :: limit => ${limit}`,
      );
      app.log.debug(
        `UserRoute :: handleRequest :: findAll() :: role => ${role}`,
      );
      app.log.debug(
        `UserRoute :: handleRequest :: findAll() :: skip => ${skip}`,
      );

      let filtro: any = {};

      if (nome) {
        filtro["nome"] = { $regex: nome, $options: "i" };
      }

      if (limit) {
        filtro["limit"] = limit;
      }

      if (role) {
        filtro["role"] = role;
      }

      if (skip) {
        filtro["skip"] = skip;
      }

      await userService
        .findAll(filtro)
        .then((users) => {
          app.log.debug(
            `UserRoute :: handleRequest :: get all users :: users.length :: ${users.length}`,
          );
          return reply.status(200).send(users);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: findAll() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to count how many user are in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/users/count",
    schema: optsGETCOUNT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: count()`);

      let { nome, role } = request.query;

      app.log.debug(`UserRoute :: handleRequest :: count() :: nome => ${nome}`);

      app.log.debug(`UserRoute :: handleRequest :: count() :: role => ${role}`);

      let filtro: any = {};

      if (nome) {
        filtro["nome"] = { $regex: nome, $options: "i" };
      }

      if (role) {
        filtro["role"] = { $regex: role, $options: "i" };
      }

      app.log.debug(`UserRoute :: handleRequest :: count() :: nome => ${nome}`);

      app.log.debug(`UserRoute :: handleRequest :: count() :: role => ${role}`);

      await userService
        .count(filtro)
        .then((count) => {
          app.log.debug(
            `UserRoute :: handleRequest :: count :: ${JSON.stringify(count)}`,
          );
          reply.status(200).send(count);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: count() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to findById an user in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/users/:id",
    schema: optsGETONE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: findById()`);

      const { id }: any = request.params;

      app.log.debug(`UserRoute :: handleRequest :: findById() :: id :: ${id}`);

      await userService
        .findById(id)
        .then((user) => {
          app.log.debug(
            `UserRoute :: handleRequest :: get one user :: ${JSON.stringify(user)}`,
          );
          if (!user) {
            reply.callNotFound();
          } else {
            reply.status(200).send(user);
          }
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: findById() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to register an user in the sanitation platform
   */
  app.route({
    method: "POST",
    url: "/api/users/register",
    schema: optsRegisterPOST.schema,
    // preHandler: app.auth([app.validateCredential, app.validatePermission], {
    //   relation: "and",
    // }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: create()`);

      await userService
        .create(request?.body as User)
        .then((result) => {
          app.log.debug(
            `UserRoute :: handleRequest :: create a user :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: create() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an user in the sanitation platform
   */
  app.route({
    method: "PUT",
    url: "/api/users/:id",
    schema: optsPUT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { nome, password, telefone }: any = request?.body;

      let partialUser = {
        id: id,
        nome: nome,
        password: password,
        telefone: telefone,
      };

      app.log.debug(
        `UserRoute :: handleRequest :: user to Update :: ${JSON.stringify(partialUser)}`,
      );

      await userService
        .update(partialUser)
        .then((result) => {
          app.log.debug(
            `UserRoute :: handleRequest :: update a user :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to delete an user in the sanitation platform
   */
  app.route({
    method: "DELETE",
    url: "/api/users/:id",
    schema: optsDELETE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: delete()`);

      const { id }: any = request.params;

      app.log.debug(
        `UserRoute :: handleRequest :: delete() :: idToDelete :: ${id}`,
      );

      await userService
        .delete(id)
        .then((result) => {
          app.log.debug(
            `UserRoute :: handleRequest :: delete a user :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(JSON.stringify(result));
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: delete() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to login an user in the sanitation platform
   */
  app.route({
    method: "POST",
    url: "/api/users/login",
    schema: optsLoginPOST.schema,
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: login()`);

      await userService
        .login(request?.body as User)
        .then((user) => {
          app.log.debug(
            `UserRoute :: handleRequest :: login the user :: ${JSON.stringify(user)}`,
          );
          reply.status(200).send(user);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: login() :: exception handling request :: error :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to change the temporary password of an user in the sanitation platform
   */
  app.route({
    method: "PUT",
    url: "/api/users/change-password/:id",
    schema: optsPUT.schema,
    handler: async (request: any, reply) => {
      app.log.debug(`UserRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { password, newPassword, isProfileUpdate }: any = request?.body;

      let partialUser = {
        id: id,
        password: password,
        newPassword: newPassword,
      };

      app.log.debug(
        `UserRoute :: handleRequest :: user to change password :: ${JSON.stringify(partialUser.id)}`,
      );

      await userService
        .changePassword(partialUser, isProfileUpdate)
        .then((result) => {
          app.log.debug(
            `UserRoute :: handleRequest :: changePassword of the user :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `UserRoute :: handleRequest :: changePassword() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

});
