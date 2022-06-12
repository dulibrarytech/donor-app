const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { baseUrl } = require(`./${process.env.CONFIGURATION_FILE}`);

//const transactionsRoutes = require("./server/routes/transactions");
// const donorsRoutes = require("../server/routes/donors");
// const donationsRoutes = require("../server/routes/donations");

const donorRoutes = require("../server/donor/routes");
const donationRoutes = require("../server/donation/routes");

module.exports = function () {

  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan('tiny'));

  //app.use('/api/transactions', transactionsRoutes);
  app.use('/donor', donorRoutes);
  app.use('/donation', donationRoutes);

  app.route('/')
    .get(function(req, res) {
      //     res.redirect(baseUrl);
      res.sendStatus(403);
  });

  return app;
};
