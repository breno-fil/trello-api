import { FastifyInstance } from "fastify";

// User Schema
const boardSchema = {
  $id: 'Board',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Board id'
    },
    name: {
      type: 'string',
      description: 'Board name'
    },
    background_color: {
      type: 'string',
      description: 'Board background color'
    },
    text_color: {
      type: 'string',
      description: 'Board text color'
    },
    created_by: {
        type: 'string',
        description: 'Board creation date'
    }

  }
};

export function registerboardSchema(app: FastifyInstance) {
  app.addSchema(boardSchema);
}
