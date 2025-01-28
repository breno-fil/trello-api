import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import path from "path";

export function registerStaticSiteProvider(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '/../../public')
  });
}
