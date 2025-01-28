import fastifyAuth from "@fastify/auth";
import { FastifyInstance } from "fastify";

export function registerAuthProvider(app: FastifyInstance) {
  app.register(fastifyAuth)
}
