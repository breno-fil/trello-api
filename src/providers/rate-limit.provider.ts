import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from "fastify";

export function registerRateLimitProvider(app: FastifyInstance) {
  app.register(rateLimit, {
    max: 100, // default 1000
    timeWindow: 10000, // default 1000 * 60
  });
}