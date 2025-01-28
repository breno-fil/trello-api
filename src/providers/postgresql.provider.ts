import fastifyPostgreSQL from "@fastify/postgres";
import { FastifyInstance } from "fastify";

export function registerPostgreSQLProvider(app: FastifyInstance) {

  app.register(fastifyPostgreSQL, {
    connectionString: 'postgres://postgres:1234@localhost/postgres'
  });
}