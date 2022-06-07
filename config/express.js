const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { baseUrl } = require(`./${process.env.CONFIGURATION_FILE}`);

//const transactionsRoutes = require("./server/routes/transactions");
const donorRoutes = require("../server/routes/donor");

module.exports = function () {

  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan('tiny'));

  //app.use('/api/transactions', transactionsRoutes);
  app.use('/donor', donorRoutes);

  app.route('/')
      .get(function(req, res) {
          res.redirect(baseUrl);
  });

  return app;
};
