import { config } from "dotenv";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { CardService } from "./card.service";
import { Card } from "./card.model";

config();

const optsGETALL = {
  schema: {
    description: "Get All Cards from the Sanitation platform.",
    summary: "Get All Cards.",
    tags: ["Card"],
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
        }
      },
    },
    response: {
      200: {
        description: "Array of Cards from the Sanitation platform",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            list_id: { type: "number" },
            position: { type: "number" },
            due_date: { type: "string" },
            created_at: { type: "string" },
            description: { type: "string" }
          },
        },
        example: [
          {
            id: "string",
            name: "string",
            list_id: "number",
            position: "number",
            due_date: "string",
            created_at: "string",
            description: "string"
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
    description: "Register a Card in the Sanitation platform.",
    summary: "Register a Card.",
    tags: ["Card"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        list_id: { type: "number" },
        position: { type: "number" },
        due_date: { type: "string" },
        created_at: { type: "string" },
        description: { type: "string" }
      },
    },
    response: {
      200: {
        description: "Card registered at the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          list_id: { type: "number" },
          position: { type: "number" },
          due_date: { type: "string" },
          created_at: { type: "string" },
          description: { type: "string" }
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

const optsGETCOUNT = {
  schema: {
    description: "Get the total of Cards from the Sanitation platform.",
    summary: "Get count of Cards.",
    tags: ["Card"],
    response: {
      200: {
        description: "Count of the Cards from the Sanitation platform",
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
    description: "Get a Card of Sanitation platform.",
    summary: "Get one Card.",
    tags: ["Card"],
    response: {
      200: {
        description: "Card from the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          list_id: { type: "number" },
          position: { type: "number" },
          due_date: { type: "string" },
          created_at: { type: "string" },
          description: { type: "string" }
        },
        example: {
          id: "number",
          name: "string",
          list_id: "number",
          position: "number",
          due_date: "string",
          created_at: "string",
          description: "string"
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
    description: "Update a Card in the Sanitation platform.",
    summary: "Update a Card.",
    tags: ["Card"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        list_id: { type: "number" },
        position: { type: "number" },
        due_date: { type: "string" },
        created_at: { type: "string" },
        description: { type: "string" }
      },
    },
    response: {
      200: {
        description: "Card updated at the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          list_id: { type: "number" },
          position: { type: "number" },
          due_date: { type: "string" },
          created_at: { type: "string" },
          description: { type: "string" }
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
    description: "Update a partial Card in the Sanitation platform.",
    summary: "Update a partial Card.",
    tags: ["Card"],
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        list_id: { type: "number" },
        position: { type: "number" },
        due_date: { type: "string" },
        created_at: { type: "string" },
        description: { type: "string" }
      },
    },
    response: {
      200: {
        description: "Card updated at the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          list_id: { type: "number" },
          position: { type: "number" },
          due_date: { type: "string" },
          created_at: { type: "string" },
          description: { type: "string" }
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
    description: "Delete a Card of Sanitation platform.",
    summary: "Delete one Card.",
    tags: ["Card"],
    response: {
      200: {
        description: "Card deleted at the Sanitation platform",
        type: "object",
        properties: {
          id: { type: "number" }
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

const cardService = new CardService();

export default fastifyPlugin(async (app: FastifyInstance) => {

  /**
   * Route to find all Cards of the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/cards",
    schema: optsGETALL.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: findAll()`);

      let { nome, limit, skip, list_id } = request.query;

      app.log.debug(`CardRoute :: handleRequest :: findAll() :: nome => ${nome}`);
      app.log.debug(`CardRoute :: handleRequest :: findAll() :: skip => ${skip}`);
      app.log.debug(`CardRoute :: handleRequest :: findAll() :: limit => ${limit}`);
      app.log.debug(`CardRoute :: handleRequest :: findAll() :: list_id => ${list_id}`);

      let filtro: any = {};

      if (nome) {
        filtro["nome"] = { $regex: nome, $options: "i" };
      }

      if (limit) filtro["limit"] = limit;

      if (skip) filtro["skip"] = skip;

      if (list_id) filtro["list_id"] = list_id;

      await cardService
        .findAll(filtro)
        .then((cards) => {
          app.log.debug(`CardRoute :: handleRequest :: get all Cards :: Cards.length :: ${cards.length}`);
          return reply.status(200).send(cards);
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: findAll() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to count how many Card are in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/cards/count",
    schema: optsGETCOUNT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: count()`);

      let { name, created_by } = request.query;

      app.log.debug(`CardRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`CardRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      let filtro: any = {};

      if (name) filtro["name"] = name;

      if (created_by) filtro["role"] = created_by;

      app.log.debug(`CardRoute :: handleRequest :: count() :: name => ${name}`);

      app.log.debug(`CardRoute :: handleRequest :: count() :: created_by => ${created_by}`);

      await cardService
        .count(filtro)
        .then((count) => {
          app.log.debug(
            `CardRoute :: handleRequest :: count :: ${JSON.stringify(count)}`,
          );
          reply.status(200).send(count);
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: count() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to findById an Card in the sanitation platform
   */
  app.route({
    method: "GET",
    url: "/api/cards/:id",
    schema: optsGETONE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: findById()`);

      const { id }: any = request.params;

      app.log.debug(`CardRoute :: handleRequest :: findById() :: id :: ${id}`);

      await cardService
        .findById(id)
        .then((Card) => {
          app.log.debug(
            `CardRoute :: handleRequest :: get one Card :: ${JSON.stringify(Card)}`,
          );
          if (!Card) {
            reply.callNotFound();
          } else {
            reply.status(200).send(Card);
          }
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: findById() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to register an Card in the sanitation platform
   */
  app.route({
    method: "POST",
    url: "/api/cards",
    schema: optsRegisterPOST.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: create()`);

      await cardService
        .create(request?.body as Card)
        .then((result) => {
          app.log.debug(`CardRoute :: handleRequest :: create a Card :: ${JSON.stringify(result.rows[0])}`);
          reply.status(200).send(result.rows[0]);
        })
        .catch((error) => {
          app.log.error(`CardRoute :: handleRequest :: create() :: exception handling request :: ${error}`);
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update an Card in the sanitation platform
   */
  app.route({
    method: "PUT",
    url: "/api/cards/:id",
    schema: optsPUT.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { name, list_id, position, due_date, created_at, description }: any = request?.body;

      let partialCard: Partial<Card> = {
        id: id,
        name: name,
        list_id: list_id,
        position: position,
        due_date: due_date,
        created_at: created_at,
        description: description
      };

      app.log.debug(`CardRoute :: handleRequest :: Card to Update :: ${JSON.stringify(partialCard)}`);

      await cardService
        .update(partialCard)
        .then((result) => {
          app.log.debug(`CardRoute :: handleRequest :: update a Card :: ${JSON.stringify(result.rows[0])}`);
          reply.status(200).send(result.rows[0]);
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to update a partial Card in the sanitation platform
   */
  app.route({
    method: "PATCH",
    url: "/api/cards/:id",
    schema: optsPATCH.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: update()`);

      const { id }: any = request.params;
      const { name, list_id, position, due_date, created_at, description }: any = request?.body;

      let partialCard: Partial<Card> = { id: id };

      if (name) {
        partialCard.name = name;
      }

      if (list_id) {
        partialCard.list_id = list_id;
      }

      if (position) {
        partialCard.position = position;
      }

      if (due_date) {
        partialCard.due_date = due_date;
      }

      if (created_at) {
        partialCard.created_at = created_at;
      }

      if (description) {
        partialCard.description = description;
      }

      app.log.debug(`CardRoute :: handleRequest :: Card to Update :: ${JSON.stringify(partialCard)}`);

      await cardService
        .patch(partialCard)
        .then((result) => {
          app.log.debug(
            `CardRoute :: handleRequest :: update a Card :: ${JSON.stringify(result)}`,
          );
          reply.status(200).send(result);
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: update() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

  /**
   * Route to delete an Card in the sanitation platform
   */
  app.route({
    method: "DELETE",
    url: "/api/cards/:id",
    schema: optsDELETE.schema,
    preHandler: app.auth([app.validateCredential, app.validatePermission], {
      relation: "and",
    }),
    handler: async (request: any, reply) => {
      app.log.debug(`CardRoute :: handleRequest :: delete()`);

      const { id }: any = request.params;

      app.log.debug(`CardRoute :: handleRequest :: delete() :: idToDelete :: ${id}`);

      await cardService
        .delete(id)
        .then((result) => {
          app.log.debug(`CardRoute :: handleRequest :: delete a Card :: ${JSON.stringify(result)}`);
          reply.status(200).send(JSON.stringify(result));
        })
        .catch((error) => {
          app.log.error(
            `CardRoute :: handleRequest :: delete() :: exception handling request :: ${error}`,
          );
          throw new Error(error);
        });
    },
  });

});
