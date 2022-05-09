require('dotenv').config();

module.exports = {
    port: process.env.SERVER_PORT || 3000,
    databaseHost: process.env.DATABASE_HOST,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PWD,
    databaseName: process.env.DATABASE_NAME
}