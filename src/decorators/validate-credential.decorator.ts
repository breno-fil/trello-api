import { FastifyInstance } from "fastify";
import { UserService } from "../modules/user/user.service";

const userService = new UserService();

export function registerValidadeCredentialDecorator(app: FastifyInstance) {
  app.decorate("validateCredential", (request: any, reply: any, done: any) => {
    app.log.debug(`validateCredential :: inicio`);

    if (!request.headers.authorization) {
      app.log.error(
        `validateCredential :: Error validating the credential :: header without authorization`,
      );
      reply.code(401);
      throw new Error(
        "validateCredential :: Error validating the credential :: header without authorization",
      );
    }

    const token = request.headers.authorization.replace("Bearer ", "");

    app.log.debug(`validateCredential :: token to validate :: ${token}`);

    userService
      .findByToken(token)
      .then((user) => {
        if (!user) {
          app.log.error(
            `validateCredential :: findByToken :: Authentication failed!`,
          );
          reply.code(401).send({
            ok: false,
            statusCode: 401,
            error: "Authentication failed!",
          });
          done();
        } else {
          request.user = user;
          request.token = token;

          app.log.debug(
            `validateCredential :: user :: ${JSON.stringify(user)}`,
          );

          reply.code(200);
          done();
        }
      })
      .catch((error) => {
        app.log.error(
          `validateCredential :: findByToken :: exception handling request :: ${error}`,
        );
        return reply.code(500).send(error);
      });
  });
}
