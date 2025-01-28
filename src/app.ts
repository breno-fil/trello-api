import { FastifyInstance } from 'fastify';
import { createServer } from './core/createServer';

// Create a new instance of the server
const server: FastifyInstance = createServer();

export default server;