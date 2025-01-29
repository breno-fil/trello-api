import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Board } from "./board.model";
import { BoardService } from "./board.service";

config();

const optsGETALL = {
  schema: {
    description: "Get All Boards from the Sanitation platform.",
    summary: "Get All Boards.",
    tags: ["Board"],
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
        user_id: {
          type: "number",
          description: "the user id"
        }
      },
    },
    response: {
      200: {
        description: "Array of Boards from the Sanitation platform",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            background_color: { type: "string" },
            text_color: { type: "string" },
          },
        },
        example: [
          {
            id: "string",
            name: "string",
            background_color: "string",
            text_color: "string",
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
    description: "Register a Board in the Sanitation platform.",
    summary: "Register a Board.",
    tags: ["Board"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        text_color: { type: "string" },
        background_color: { type: "string" },
        created_by: { type: "number" }
      }
    },
    response: {
      200: {
        description: "Board registered at the Sanitation platform",
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
    description: "Get the total of Boards from the Sanitation platform.",
    summary: "Get count of Boards.",
    tags: ["Board"],
    response: {
      200: {
        description: "Count of the Boards from the Sanitation platform",
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
    description: "Get a Board of Sanitation platform.",
    summary: "Get one Board.",
    tags: ["Board"],
    response: {
      200: {
        description: "Board from the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          background_color: { type: "string" },
          text_color: { type: "string" },
        },
        example: {
            id: "string",
            name: "string",
            background_color: "string",
            text_color: "string",
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
    description: "Update a Board in the Sanitation platform.",
    summary: "Update a Board.",
    tags: ["Board"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        background_color: { type: "string" },
        text_color: { type: "string" },
        created_by: {type: "number"}
      },
    },
    response: {
      200: {
        description: "Board updated at the Sanitation platform",
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          modifiedCount: { type: "number" },
          upsertedId: { type: "string" },
          upsertedCount: { type: "number" },
          matchedCount: { type: "number" }
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

const optsPATCH = {
  schema: {
    description: "Update a partial Board in the Sanitation platform.",
    summary: "Update a partial Board.",
    tags: ["Board"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        background_color: { type: "string" },
        text_color: { type: "string" }
      },
    },
    response: {
      200: {
        description: "Board updated at the Sanitation platform",
        type: "object",
        properties: {
          id: {type: "number"},
          name: {type: "string"},
          background_color: {type: "string"},
          text_color: {type: "string"},
          created_by: {type: "number"}
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
    description: "Delete a Board of Sanitation platform.",
    summary: "Delete one Board.",
    tags: ["Board"],
    response: {
      200: {
        description: "Board deleted at the Sanitation platform",
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

const boardService = new BoardService();

export default fastifyPlugin(async (app: FastifyInstance) => {

  /**
   * Route to find all Boards of the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/boards",
    schema: optsGETALL.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: findAll()`);

      let { limit, skip, user_id } = request.query;

      app.log.debug(`BoardRoute :: handleRequest :: findAll() :: limit => ${limit}`);
      app.log.debug(`BoardRoute :: handleRequest :: findAll() :: skip => ${skip}`);
      app.log.debug(`BoardRoute :: handleRequest :: findAll() :: user_id => ${user_id}`);

      let filtro: any = {};

      if (limit) filtro["limit"] = limit;
      
      if (skip) filtro["skip"] = skip;
      
      if (user_id) filtro["user_id"] = user_id;

      await boardService
        .findAll(filtro)
        .then((Boards) => {
          app.log.debug(`BoardRoute :: handleRequest :: get all Boards :: Boards.length :: ${Boards.length}`);
          return reply.status(200).send(Boards);
        })
        .catch((error) => {
          app.log.error(`BoardRoute :: handleRequest :: findAll() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to count how many Board are in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/boards/count",
    schema: optsGETCOUNT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: count()`);

      let { name, created_by } = request.query;

      app.log.debug(`BoardRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`BoardRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      let filtro: any = {};

      if (name) filtro["name"] = name;

      if (created_by) filtro["role"] = created_by;

      app.log.debug(`BoardRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`BoardRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      await boardService
        .count(filtro)
        .then((count) => {
          app.log.debug(
            `BoardRoute :: handleRequest :: count :: ${JSON.stringify(count)}`,
          );
          reply.status(200).send(count);
        })
        .catch((error) => {
          app.log.error(
            `BoardRoute :: handleRequest :: count() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to findById an Board in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/boards/:id",
    schema: optsGETONE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: findById()`);

      const { id }: any = request.params;

      app.log.debug(`BoardRoute :: handleRequest :: findById() :: id :: ${id}`);

      await boardService
        .findById(id)
        .then((Board) => {
          app.log.debug(
            `BoardRoute :: handleRequest :: get one Board :: ${JSON.stringify(Board)}`,
          );
          if (!Board) {
            reply.callNotFound();
          } else {
            reply.status(200).send(Board);
          }
        })
        .catch((error) => {
          app.log.error(
            `BoardRoute :: handleRequest :: findById() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to register an Board in the sanitation platform
   */
  app.route({
    method: "POST",
    url: "/api/boards",
    schema: optsRegisterPOST.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: create()`);

      await boardService
        .create(request?.body as Board)
        .then((result) => {
          app.log.debug(`BoardRoute :: handleRequest :: create a Board :: ${JSON.stringify(result)}`);
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(`BoardRoute :: handleRequest :: create() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an Board in the sanitation platform
   */
  app.route({
    method: "PUT",
    url: "/api/boards/:id",
    schema: optsPUT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { name, background_color, text_color }: any = request?.body;

      let partialBoard = {
        id: id,
        name: name,
        background_color: background_color,
        text_color: text_color
      };

      app.log.debug(
        `BoardRoute :: handleRequest :: Board to Update :: ${JSON.stringify(partialBoard)}`,
      );

      await boardService
        .update(partialBoard)
        .then((result) => {
          app.log.debug(
            `BoardRoute :: handleRequest :: update a Board :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `BoardRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  app.route({
    method: "PATCH",
    url: "/api/boards/:id",
    schema: optsPATCH.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: patch()`);

      const { id }: any = request.params;
      const { name, background_color, text_color }: any = request?.body;

      let partialBoard: Partial<Board> = {id: id};
      
      if (name) {
        partialBoard.name = name
      }

      if (background_color) {
        partialBoard.background_color = background_color;
      }

      if (text_color) {
        partialBoard.text_color = text_color;
      }

      app.log.debug(`BoardRoute :: handleRequest :: Board to patch :: ${JSON.stringify(partialBoard)}`);

      await boardService
        .patch(partialBoard)
        .then((result) => {
          app.log.debug(
            `BoardRoute :: handleRequest :: patch a Board :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `BoardRoute :: handleRequest :: patch() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to delete an Board in the sanitation platform
   */
  app.route({
    method: "DELETE",
    url: "/api/boards/:id",
    schema: optsDELETE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`BoardRoute :: handleRequest :: delete()`);

      const { id }: any = request.params;

      app.log.debug(
        `BoardRoute :: handleRequest :: delete() :: idToDelete :: ${id}`,
      );

      await boardService
        .delete(id)
        .then((result) => {
          app.log.debug(
            `BoardRoute :: handleRequest :: delete a Board :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(JSON.stringify(result));
        })
        .catch((error) => {
          app.log.error(
            `BoardRoute :: handleRequest :: delete() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

});
