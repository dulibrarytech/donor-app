/**
 * @file
 *
 * donor-app.js
 * Donor App node bootstrap file
 */

require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

var express = require('./config/express');
var app = express();

app.listen(process.env.NODE_PORT, () => {
  console.log(`Donor App is running on port ${process.env.NODE_PORT} in ${process.env.NODE_ENV} mode`);
});
module.exports = app;
