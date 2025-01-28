import { FastifyInstance } from "fastify";
import { User } from "../modules/user/user.model";
import { UserService } from "../modules/user/user.service";

const userService = new UserService();

export function registerValidadePermissionDecorator(app: FastifyInstance) {
  app.decorate("validatePermission", (request: any, reply: any, done: any) => {
    app.log.debug(`validatePermission :: inicio`);

    if (!request.headers.authorization) {
      app.log.error(
        `validatePermission :: Error validating the credential :: header without authorization`,
      );
      reply.code(401);
      throw new Error(
        "validatePermission :: Error validating the credential :: header without authorization",
      );
    }

    const token = request.headers.authorization.replace("Bearer ", "");

    app.log.debug(`validatePermission :: token to validate :: ${token}`);
    app.log.debug(`validatePermission :: request.url :: ${request.url}`);
    app.log.debug(`validatePermission :: request.method :: ${request.method}`);

    const operacao: string = request.method;
    app.log.debug(`validatePermission :: request operacao :: ${operacao}`);

    const entidade: string = request.routeOptions.url.split("/")[2];
    app.log.debug(`validatePermission :: request entidade :: ${entidade}`);

    let tokenDecoded: Partial<User> = app.jwt.verify(token, {
      key: process.env.JWT_SECRET,
    });

    app.log.debug(
      `validatePermission :: jwt.verify token decoded :: ${JSON.stringify(tokenDecoded)}`,
    );

    const id: any = tokenDecoded.id;
    app.log.debug(`validatePermission :: token id :: ${id}`);

    userService
      .findById(id)
      .then((user) => {
        if (!user) {
          app.log.error(
            `validatePermission :: user :: No user found!`,
          );
          reply.code(401);
          throw new Error("No Permission found!");
        } else {
          app.log.debug(
            `validatePermission :: user :: ${JSON.stringify(user)}`,
          );
          reply.code(200);
          done();
        }
      })
      .catch((error) => {
        app.log.error(
          `validatePermission :: checkUserPermission :: exception handling request :: ${error}`,
        );
        return reply.code(reply.statusCode ?? 500).send(error);
      });
  });
}
