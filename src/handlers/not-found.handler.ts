import { FastifyInstance } from "fastify";

export function registerNotFoundHandler(app: FastifyInstance) {
  app.setNotFoundHandler(function (request, reply) {
    app.log.error(
      `setNotFoundHandler :: error :: request.params :: ${JSON.stringify(request.params)}`,
    );
    reply.status(404).send({
      statusCode: 404,
      message: "Resource not found",
    });
  });
}
