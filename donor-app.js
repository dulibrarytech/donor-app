/**
 * @file
 *
 * donor-app.js
 * Donor App node bootstrap file
 */

require('dotenv').config();

var express = require('./config/express');
var app = express();

app.listen(process.env.NODE_PORT, () => {
  console.log(`Donor App is running on port ${process.env.NODE_PORT} in ${process.env.NODE_ENV} mode`);
});
module.exports = app;
