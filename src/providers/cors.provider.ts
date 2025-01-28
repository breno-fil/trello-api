import { FastifyInstance } from "fastify";
import Cors from "@fastify/cors";

// Cors Policies Options
const corsOptions = {
  // Allow all origins
  origin: "*"
};

export function registerCorsProvider(app: FastifyInstance) {
  app.register(Cors, corsOptions)
}
