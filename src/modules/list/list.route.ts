import { config } from "dotenv";
import { List } from "./list.model";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { ListService } from "./list.service";

config();

const optsGETALL = {
  schema: {
    description: "Get All Lists from the Trello platform.",
    summary: "Get All Lists.",
    tags: ["List"],
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
        description: "Array of Lists from the Trello platform",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            board_id: { type: "number" },
            position: { type: "number" },
          },
        },
        example: [
          {
            id: "number",
            name: "string",
            board_id: "number",
            position: "number",
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
    description: "Register a List in the Trello platform.",
    summary: "Register a List.",
    tags: ["List"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        board_id: { type: "number" },
        position: { type: "number" }
      },
    },
    response: {
      200: {
        description: "List registered at the Trello platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          position: {type: "number"},
          board_id: { type: "number" }
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
    description: "Get the total of Lists from the Trello platform.",
    summary: "Get count of Lists.",
    tags: ["List"],
    response: {
      200: {
        description: "Count of the Lists from the Trello platform",
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
    description: "Get a List of Trello platform.",
    summary: "Get one List.",
    tags: ["List"],
    response: {
      200: {
        description: "List from the Trello platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          board_Id: { type: "number" },
          position: { type: "number" },
        },
        example: {
            id: "number",
            name: "string",
            board_Id: "number",
            position: "number",
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
    description: "Update a List in the Trello platform.",
    summary: "Update a List.",
    tags: ["List"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        board_id: { type: "number" },
        position: { type: "number" },
      },
    },
    response: {
      200: {
        description: "List updated at the Trello platform",
        type: "object",
        properties: {
          id: {type: "number"},
          name: {type: "string"},
          board_id: {type: "number"},
          position: {type: "number"}
        },
        example: {
          id: "number",
          name: "string",
          board_id: "number",
          position: "number"
        }
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
    description: "Update a partial List in the Trello platform.",
    summary: "Update a partial List.",
    tags: ["List"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        board_id: { type: "number" },
        position: { type: "number" }
      }
    },
    response: {
      200: {
        description: "List updated at the Trello platform",
        type: "object",
        properties: {
          id: {type: "number"},
          name: {type: "string"},
          board_id: {type: "number"},
          position: {type: "number"}
        },
        example: {
          id: "number",
          name: "string",
          board_id: "number",
          position: "number"
        }
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
    description: "Delete a List of Trello platform.",
    summary: "Delete one List.",
    tags: ["List"],
    response: {
      200: {
        description: "List deleted at the Trello platform",
        type: "object",
        properties: {
          id: {type: "number"},
          name: {type: "string"},
          board_id: {type: "string"},
          position: {type: "number"}
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

const listService = new ListService();

export default fastifyPlugin(async (app: FastifyInstance) => {

  /**
   * Route to find all Lists of the Trello platform
   */
  app.route({
    method: "GET",
    url: "/api/lists",
    schema: optsGETALL.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: findAll()`);

      let { nome, limit, role, skip, board_id } = request.query;

      app.log.debug(
        `ListRoute :: handleRequest :: findAll() :: nome => ${nome}`,
      );
      app.log.debug(
        `ListRoute :: handleRequest :: findAll() :: limit => ${limit}`,
      );
      app.log.debug(
        `ListRoute :: handleRequest :: findAll() :: role => ${role}`,
      );
      app.log.debug(
        `ListRoute :: handleRequest :: findAll() :: skip => ${skip}`,
      );

      app.log.debug(
        `ListRoute :: handleRequest :: findAll() :: board_id => ${board_id}`,
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

      if (board_id) {
        filtro["board_id"] = board_id;
      }

      await listService
        .findAll(filtro)
        .then((lists) => {
          app.log.debug(
            `ListRoute :: handleRequest :: get all Lists :: Lists.length :: ${lists.length}`,
          );
          return reply.status(200).send(lists);
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: findAll() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to count how many List are in the Trello platform
   */
  app.route({
    method: "GET",
    url: "/api/lists/count",
    schema: optsGETCOUNT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: count()`);

      let { name, created_by } = request.query;

      app.log.debug(`ListRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`ListRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      let filtro: any = {};

      if (name) filtro["name"] = name;

      if (created_by) filtro["role"] = created_by;

      app.log.debug(`ListRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`ListRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      await listService
        .count(filtro)
        .then((count) => {
          app.log.debug(
            `ListRoute :: handleRequest :: count :: ${JSON.stringify(count)}`,
          );
          reply.status(200).send(count);
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: count() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to findById an List in the Trello platform
   */
  app.route({
    method: "GET",
    url: "/api/lists/:id",
    schema: optsGETONE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: findById()`);

      const { id }: any = request.params;

      app.log.debug(`ListRoute :: handleRequest :: findById() :: id :: ${id}`);

      await listService
        .findById(id)
        .then((list) => {
          app.log.debug(`ListRoute :: handleRequest :: findById() :: get one List :: ${JSON.stringify(list)}`);
          if (!list) {
            reply.callNotFound();
          } else {
            reply.status(200).send(list);
          }
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: findById() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to register an List in the Trello platform
   */
  app.route({
    method: "POST",
    url: "/api/lists",
    schema: optsRegisterPOST.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: create()`);

      await listService
        .create(request?.body as List)
        .then((result) => {
          app.log.debug(`ListRoute :: handleRequest :: create a List :: ${JSON.stringify(result)}`);
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(`ListRoute :: handleRequest :: create() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an List in the Trello platform
   */
  app.route({
    method: "PUT",
    url: "/api/lists/:id",
    schema: optsPUT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { name, board_id, position }: any = request?.body;

      let partialList = {
        id: id,
        name: name,
        board_id: board_id,
        position: position,
      };

      app.log.debug(`ListRoute :: handleRequest :: List to Update :: ${JSON.stringify(partialList)}`);

      await listService
        .update(partialList)
        .then((result) => {
          app.log.debug(
            `ListRoute :: handleRequest :: update a List :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an List in the Trello platform
   */
  app.route({
    method: "PATCH",
    url: "/api/lists/:id",
    schema: optsPATCH.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: patch()`);

      const { id }: any = request.params;
      const { name, board_id, position }: any = request?.body;

      let partialList: Partial<List> = {id: id};

      if (name) partialList.name = name;

      if (board_id) partialList.board_id = Number(board_id);

      if (position) partialList.position = Number(position);

      app.log.debug(`ListRoute :: handleRequest :: list to patch :: ${JSON.stringify(partialList)}`);

      await listService
        .patch(partialList)
        .then((result) => {
          app.log.debug(`ListRoute :: handleRequest :: patch a List :: ${JSON.stringify(result)}`);
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: patch() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to delete an List in the Trello platform
   */
  app.route({
    method: "DELETE",
    url: "/api/lists/:id",
    schema: optsDELETE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`ListRoute :: handleRequest :: delete()`);

      const { id }: any = request.params;

      app.log.debug(`ListRoute :: handleRequest :: delete() :: list id :: ${id}`);

      await listService
        .delete(id)
        .then((result) => {
          app.log.debug(`ListRoute :: handleRequest :: delete a List :: ${JSON.stringify(result)}`);
          reply.status(200).send(JSON.stringify(result));
        })
        .catch((error) => {
          app.log.error(
            `ListRoute :: handleRequest :: delete() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

});
