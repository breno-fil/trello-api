/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(fastify-slow-down)/)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
};
