require('dotenv').config();

module.exports = {
    runtimeEnv: process.env.NODE_ENV,
    port: process.env.NODE_PORT || 3000,
    basePath: process.env.BASE_PATH,
    corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
    databaseHost: process.env.DATABASE_HOST,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PWD,
    databaseName: process.env.DATABASE_NAME,
    authServiceUrl: process.env.AUTH_SERVICE_URL,
    tokenKey: process.env.AUTH_TOKEN_SECRET_KEY,
    sessionTokenDuration: process.env.SESSION_TOKEN_DURATION,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailNotificationLinkDonorAppUrl: process.env.EMAIL_NOTIFICATION_LINK_DONOR_APP_URL,
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS
}
