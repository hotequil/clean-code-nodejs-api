export default {
    MONGO_URL: process.env.MONGO_URL ?? "mongodb://mongo:27017/clean-code-nodejs-api",
    PORT: process.env.PORT ?? 4000,
    JWT_SECRET: process.env.JWT_SECRET ?? "wMbDbbSxdC"
};
