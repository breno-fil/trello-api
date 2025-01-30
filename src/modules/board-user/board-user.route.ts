import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { BoardUser } from "./board-user.model";
import { BoardUserService } from "./board-user.service";

config();

const optsGETALL = {
  schema: {
    description: "Get All Boards from the Trello platform.",
    summary: "Get All Boards.",
    tags: ["Board Users"],
    querystring: {
      type: "object",
      additionalProperties: true,
      properties: {
        board_id: {
          type: "number",
          description: "Board id",
        },
        user_id: {
          type: "number",
          description: "User id",
        },
        role: {
          type: "string",
          description: "User role"
        },
        starred: {
          type: "boolean",
          description: "Board starred status"
        }
      },
    },
    response: {
      200: {
        description: "Array of Boards from the Trello platform",
        type: "array",
        items: {
          type: "object",
          properties: {
            board_id: { type: "number" },
            user_id: { type: "number" },
            role: { type: "string" },
            starred: { type: "boolean" }
          },
        },
        example: [
          {
            board_id: "number",
            user_id: "number",
            role: "string",
            starred: "boolean",
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
    description: "Register a Board in the Trello platform.",
    summary: "Register a Board.",
    tags: ["Board Users"],
    body: {
      type: "object",
      properties: {
        board_id: { type: "number" },
        user_id: { type: "number" },
        role: { type: "string" },
        starred: { type: "boolean" }
      }
    },
    response: {
      200: {
        description: "Board registered at the Trello platform",
        type: "object",
        properties: {
          id: { type: "number" },
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
    description: "Get the total of Boards from the Trello platform.",
    summary: "Get count of Boards.",
    tags: ["Board Users"],
    response: {
      200: {
        description: "Count of the Boards from the Trello platform",
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
    description: "Get a Board of Trello platform.",
    summary: "Get one Board.",
    tags: ["Board Users"],
    querystring: {
      type: "object",
      additionalProperties: true,
      properties: {
        board_id: {
          type: "number",
          description: "board id",
        },
        user_id: {
          type: "number",
          description: "user id",
        },
      },
    },
    response: {
      200: {
        description: "Board from the Trello platform",
        type: "object",
        properties: {
          board_id: { type: "number" },
          user_id: { type: "number" },
          role: { type: "string" },
          starred: { type: "boolean" }
        },
        example: {
          board_id: "number",
          user_id: "number",
          role: "string",
          starred: "boolean",
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
    description: "Update a Board in the Trello platform.",
    summary: "Update a Board.",
    tags: ["Board Users"],
    body: {
      type: "object",
      properties: {
        board_id: { type: "number" },
        user_id: { type: "number" },
        role: { type: "string" },
        starred: { type: "boolean" }
      },
    },
    response: {
      200: {
        description: "Board updated at the Trello platform",
        type: "object",
        properties: {
          board_id: { type: "number" },
          user_id: { type: "number" },
          role: { type: "string" },
          starred: { type: "boolean" }
        },
        example: [
          {
            board_id: "number",
            user_id: "number",
            role: "string",
            starred: "boolean",
          },
        ]
      },
    },
    security: [
      {
        apiKey: [],
      },
    ],
  },
};

const optsPATCH = {
  schema: {
    description: "Update a partial Board in the Trello platform.",
    summary: "Update a partial Board.",
    tags: ["Board Users"],
    body: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        role: { type: "string" },
        starred: { type: "boolean" }
      },
    },
    response: {
      200: {
        description: "Board updated at the Trello platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          background_color: { type: "string" },
          text_color: { type: "string" },
          created_by: { type: "number" }
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
    description: "Delete a Board of Trello platform.",
    summary: "Delete one Board.",
    tags: ["Board Users"],
    response: {
      200: {
        description: "Board deleted at the Trello platform",
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

const boardUserService = new BoardUserService();

export default fastifyPlugin(async (app: FastifyInstance) => {

  /**
   * Route to find all Boards of the Trello platform
   */
  app.route({
    method: "GET",
    url: "/api/board-users",
    schema: optsGETALL.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardUserRoute :: handleRequest :: findAll()`);

      let { board_id, user_id, role, starred } = request.query;

      app.log.debug(`BoardUserRoute :: handleRequest :: findAll() :: role => ${role}`);
      app.log.debug(`BoardUserRoute :: handleRequest :: findAll() :: user_id => ${user_id}`);
      app.log.debug(`BoardUserRoute :: handleRequest :: findAll() :: starred => ${starred}`);
      app.log.debug(`BoardUserRoute :: handleRequest :: findAll() :: board_id => ${board_id}`);

      let filter: Partial<BoardUser> = {};

      if (board_id) filter["board_id"] = Number(board_id);

      if (user_id) filter["user_id"] = Number(user_id);

      if (role) filter["role"] = role;

      if (starred) filter["starred"] = Boolean(starred);

      app.log.debug(`BoardUserRoute :: handleRequest :: get all Boards :: filter :: ${JSON.stringify(filter)}`)

      await boardUserService
        .findAll(filter)
        .then((boards) => {
          app.log.debug(`BoardUserRoute :: handleRequest :: get all Boards :: Boards.length :: ${boards.length}`);
          return reply.status(200).send(boards);
        })
        .catch((error) => {
          app.log.error(`BoardUserRoute :: handleRequest :: findAll() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to count how many Board are in the Trello platform
   */
  app.route({
    method: "GET",
    url: "/api/board-users/count",
    schema: optsGETCOUNT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardUserRoute :: handleRequest :: count()`);

      let { name, created_by } = request.query;

      app.log.debug(`BoardUserRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`BoardUserRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      let filtro: any = {};

      if (name) filtro["name"] = name;

      if (created_by) filtro["role"] = created_by;

      app.log.debug(`BoardUserRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`BoardUserRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      await boardUserService
        .count(filtro)
        .then((count) => {
          app.log.debug(
            `BoardUserRoute :: handleRequest :: count :: ${JSON.stringify(count)}`,
          );
          reply.status(200).send(count);
        })
        .catch((error) => {
          app.log.error(
            `BoardUserRoute :: handleRequest :: count() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to findById an Board in the Trello platform
   */
  // app.route({
  //   method: "GET",
  //   url: "/api/board-users/:id",
  //   schema: optsGETONE.schema,
  //   preHandler: app.auth([app.validateCredential, app.validatePermission], {
  //     relation: "and",
  //   }),
  //   handler: async (request: any, reply) => {
  //     app.log.debug(`BoardUserRoute :: handleRequest :: findById()`);

  //     const { id }: any = request.params;

  //     app.log.debug(`BoardUserRoute :: handleRequest :: findById() :: id :: ${id}`);

  //     await boardUserService
  //       .findById(id)
  //       .then((Board) => {
  //         app.log.debug(
  //           `BoardUserRoute :: handleRequest :: get one Board :: ${JSON.stringify(Board)}`,
  //         );
  //         if (!Board) {
  //           reply.callNotFound();
  //         } else {
  //           reply.status(200).send(Board);
  //         }
  //       })
  //       .catch((error) => {
  //         app.log.error(
  //           `BoardUserRoute :: handleRequest :: findById() :: exception handling request :: ${error}`,
  //         );
  //         throw new Error(error);
  //       });
  //   },
  // });

  /**
   * Route to register an Board in the Trello platform
   */
  app.route({
    method: "POST",
    url: "/api/board-users",
    schema: optsRegisterPOST.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardUserRoute :: handleRequest :: create()`);

      await boardUserService
        .create(request?.body as BoardUser)
        .then((result) => {
          app.log.debug(`BoardUserRoute :: handleRequest :: create a Board :: ${JSON.stringify(result)}`);
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(`BoardUserRoute :: handleRequest :: create() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an Board in the Trello platform
   */
  app.route({
    method: "PUT",
    url: "/api/board-users",
    schema: optsPUT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardUserRoute :: handleRequest :: update()`);

      const { board_id, user_id, role, starred }: any = request?.body;

      let boardUser: BoardUser = {
        board_id: board_id,
        user_id: user_id,
        role: role,
        starred: starred
      };

      app.log.debug(`BoardUserRoute :: handleRequest :: board user to update :: ${JSON.stringify(boardUser)}`);

      await boardUserService
        .update(boardUser)
        .then((result) => {
          app.log.debug(`BoardUserRoute :: handleRequest :: update a board user :: ${JSON.stringify(result)}`);
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `BoardUserRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  // app.route({
  //   method: "PATCH",
  //   url: "/api/board-users/",
  //   schema: optsPATCH.schema,
  //   preHandler: app.auth([app.validateCredential, app.validatePermission], {
  //     relation: "and",
  //   }),
  //   handler: async (request: any, reply) => {
  //     app.log.debug(`BoardUserRoute :: handleRequest :: patch()`);

  //     const { board_id, user_id, role, starred }: any = request?.body;

  //     let partialBoard: Partial<BoardUser> = { board_id: board_id, user_id: user_id };

  //     if (role) {
  //       partialBoard.role = role
  //     }

  //     if (starred) {
  //       partialBoard.starred = starred;
  //     }

  //     app.log.debug(`BoardUserRoute :: handleRequest :: Board to patch :: ${JSON.stringify(partialBoard)}`);

  //     await boardUserService
  //       .patch(partialBoard)
  //       .then((result) => {
  //         app.log.debug(
  //           `BoardUserRoute :: handleRequest :: patch a Board :: ${JSON.stringify(result)}`,
  //         );
  //         reply.status(200).send(result);
  //       })
  //       .catch((error) => {
  //         app.log.error(
  //           `BoardUserRoute :: handleRequest :: patch() :: exception handling request :: ${error}`,
  //         );
  //         throw new Error(error);
  //       });
  //   },
  // });

  /**
   * Route to delete an Board in the Trello platform
   */
  app.route({
    method: "DELETE",
    url: "/api/board-users/:id",
    schema: optsDELETE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardUserRoute :: handleRequest :: delete()`);

      const { id }: any = request.params;

      app.log.debug(`BoardUserRoute :: handleRequest :: delete() :: idToDelete :: ${id}`);

      await boardUserService
        .delete(id)
        .then((result) => {
          app.log.debug(
            `BoardUserRoute :: handleRequest :: delete a Board :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(JSON.stringify(result));
        })
        .catch((error) => {
          app.log.error(
            `BoardUserRoute :: handleRequest :: delete() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

});
