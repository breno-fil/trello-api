import fastify, { FastifyInstance } from "fastify";
// import providers
import {
  registerAuthProvider,
  registerCorsProvider,
  registerJWTProvider,
  registerMultipartProvider,
  registerPostgreSQLProvider,
  registerRateLimitProvider,
  registerSlowDownProvider,
  registerStaticSiteProvider,
  registerSwaggerProvider,
} from "../providers/index";
// import schemas
import { registerUserSchema } from "../modules/user/user.schema";
// inport dotenv
import { config } from "dotenv";
// import routes
import userRoute from "../modules/user/user.route";
// import handlers
import {
  registerErrorHandler,
  registerNotFoundHandler,
} from "../handlers";
// import Decorators
import {
  registerValidadeCredentialDecorator,
  registerValidadePermissionDecorator,
} from "../decorators";
import { registerboardSchema } from "../modules/board/board.schema";
import boardRoute from "../modules/board/board.route";
import listRoute from "../modules/list/list.route";
import cardRoute from "../modules/card/card.route";
import boardUserRoute from "../modules/board-user/board-user.route";

config();

const envToLogger: any = {
  development: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  uat: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  test: false,
};

export function createServer() {
  // Creating a new fastify instance
  const app: FastifyInstance = fastify({
    logger: envToLogger[process.env.NODE_ENV || "production"] ?? true,
    ignoreTrailingSlash: true,
    bodyLimit: 15 * 1024 * 1024, // Default Limit set to 15MB
    ajv: {
      // Adds the file plugin to help @fastify/swagger schema generation
      plugins: [require("@fastify/multipart").ajvFilePlugin],
    },
  });

  // <<< REGISTER PROVIDERS >>>
  // Auth Provider
  registerAuthProvider(app);
  // CORS provider
  registerCorsProvider(app);
  // JWT Provider
  registerJWTProvider(app);
  // Multipart Provider
  registerMultipartProvider(app);
  // PostgreSQL Provider
  registerPostgreSQLProvider(app);
  // Rate Limit Provider
  registerRateLimitProvider(app);
  // Slow Down Provider
  registerSlowDownProvider(app);
  // Static Site Provider
  registerStaticSiteProvider(app);
  // Swagger Provider
  registerSwaggerProvider(app);

  // <<< REGISTER THE SCHEMAS >>>
  // Register board schema
  registerboardSchema(app);

  // Register user schema
  registerUserSchema(app);

  // <<< REGISTER ROUTES >>>
  // Board routes
  app.register(boardRoute);
  
  // Board User routes
  app.register(boardUserRoute);
  
  // Card routes
  app.register(cardRoute)

  // List routes
  app.register(listRoute)
  
  // User routes
  app.register(userRoute);


  // <<< REGISTER HANDLERS >>>
  // Error
  registerErrorHandler(app);
  // Not Found
  registerNotFoundHandler(app);

  // <<< REGISTER DECORATORS >>>
  // validate credential
  registerValidadeCredentialDecorator(app);
  // validate create permission
  registerValidadePermissionDecorator(app);

  // define PORT to the listener
  app.listen({
    port: (process.env.PORT || 8080) as number,
    host: "0.0.0.0",
  });

  return app;
}
