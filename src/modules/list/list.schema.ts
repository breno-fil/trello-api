import { FastifyInstance } from "fastify";

// List Schema
const listSchema = {
  $id: 'List',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User id'
    },
    name: {
      type: 'string',
      description: 'List name'
    },
    board_id: {
      type: 'string',
      description: 'Board id'
    },
    position: {
      type: 'number',
      description: 'List position'
    },

  }
};

export function registerListSchema(app: FastifyInstance) {
  app.addSchema(listSchema);
}
