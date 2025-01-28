import { FastifyInstance } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(function (error, request, reply) {
    app.log.error(`setErrorHandler :: error message :: ${error.message}`);
    app.log.error(
      `setErrorHandler :: request.params :: ${JSON.stringify(request.params)}`,
    );
    const status = (reply.statusCode >= 200 && reply.statusCode <= 299) ? 409 : reply.statusCode;
    reply.status(status).send({
      ok: false,
      statusCode: status,
      message: error.message,
    });
  });
}