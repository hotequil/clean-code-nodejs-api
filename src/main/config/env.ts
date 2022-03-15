export default {
    MONGO_URL: process.env.MONGO_URL ?? "mongodb://admin:12345678@localhost:27017/clean-code-nodejs-api",
    PORT: process.env.PORT ?? 4000,
    JWT_SECRET: process.env.JWT_SECRET ?? "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEifQ.ZAU547bnCcGrvSZiaDeYpbQg6rUopOe3HMJ01l2a2NQ"
};
