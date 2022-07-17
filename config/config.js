require('dotenv').config();

module.exports = {
    runtimeEnv: process.env.NODE_ENV || "development",
    port: process.env.NODE_PORT || 3000,
    baseUrl: process.env.SERVER_DOMAIN,
    databaseHost: process.env.DATABASE_HOST,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PWD,
    databaseName: process.env.DATABASE_NAME,
    authServiceUrl: process.env.AUTH_SERVICE_URL,
    tokenKey: process.env.AUTH_TOKEN_SECRET_KEY,
    sessionTokenDuration: process.env.SESSION_TOKEN_DURATION
}
