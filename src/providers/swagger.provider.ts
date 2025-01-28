import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export function registerSwaggerProvider(app: FastifyInstance) {

  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Trello API",
        description: "Trello api.",
        version: process.env.API_VERSION || '1.0.0',
      },
      schemes: ["http", "https"],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header'
        }
      },
      consumes: ["application/json", "multipart/form-data"],
      produces: ["application/json", "multipart/form-data"],
    }
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true,
  });

}
