import { FastifyInstance } from "fastify";

// User Schema
const cardSchema = {
    $id: 'Card',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'Card id'
        },
        name: {
            type: 'string',
            description: 'Card name'
        },
        list_id: {
            type: "number",
            description: "List the card belongs to"
        },
        position: {
            type: "number",
            description: "Card position in the list"
        },
        due_date: {
            type: "string",
            description: "Card due date"
        },
        created_at: {
            type: "string",
            description: "Card creation date"
        },
        description: {
            type: "string",
            description: "Card description."
        }
    }
};

export function registercardSchema(app: FastifyInstance) {
    app.addSchema(cardSchema);
}
