export default {
    MONGO_URL: process.env.MONGO_URL ?? "mongodb://admin:12345678@localhost:27017/clean-code-nodejs-api",
    PORT: process.env.PORT ?? 4000
};
