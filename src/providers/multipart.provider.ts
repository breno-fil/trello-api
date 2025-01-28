import { FastifyInstance } from "fastify";
import multipart from '@fastify/multipart';

export function registerMultipartProvider(app: FastifyInstance) {
  app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 5000000,  // 5MB -> the max file size in bytes
      files: 1,           // 1 -> Max number of file fields
    }
  });
}
