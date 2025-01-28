import fastify from "fastify";
import { ServerResponse, IncomingMessage, Server } from "http";

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    verifyJWT(request, reply, done): void;
    validateCredential(request, reply, done): void;
    validatePermission(request, reply, done): void;
  }
}