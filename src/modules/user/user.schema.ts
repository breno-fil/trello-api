import { FastifyInstance } from "fastify";

// User Schema
const userSchema = {
  $id: 'User',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User id'
    },
    username: {
      type: 'string',
      description: 'User name'
    },
    email: {
      type: 'string',
      description: 'User email'
    },
    password: {
      type: 'string',
      description: 'User password'
    },

  }
};

export function registerUserSchema(app: FastifyInstance) {
  app.addSchema(userSchema);
}
