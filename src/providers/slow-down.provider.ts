import slowDown from 'fastify-slow-down';
import { FastifyInstance } from "fastify";

export function registerSlowDownProvider(app: FastifyInstance) {
  app.register(slowDown, {
    delay: 10, // Base unit of time delay applied to requests.
    delayAfter: 50, // Number of requests received during timeWindow before starting to delay responses.
    timeWindow: 60000, // 1 minute in miliseconds
    maxDelay: 100000 // 100 seconds in miliseconds
  });
}