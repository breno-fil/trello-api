import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export function registerJWTProvider(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || ''
  })
}
