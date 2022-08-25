const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compress = require('compression');
const { baseUrl } = require(`./${process.env.CONFIGURATION_FILE}`);

const donorRoutes = require("../server/donor/routes");
const donationRoutes = require("../server/donation/routes");
const userRoutes = require("../server/user/routes");

module.exports = function () {

  if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      app.use(cors());
  }
  else if (process.env.NODE_ENV === 'production') {
      app.use(cors({
        origin: process.env.CORS_ALLOWED_ORIGIN
      }));
      app.use(compress());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('tiny'));

  app.use('/donor', donorRoutes);
  app.use('/donation', donationRoutes);
  app.use('/user', userRoutes);

  app.route('/')
    .get(function(req, res) {
      res.sendStatus(403);
  });

  return app;
};
