'use strict'

const Donations = require("../models/Donations.js");

exports.donations = (req, res) => {
  Donations.getAllDonations()
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      console.error(error)
      res.sendStatus(500)
    }
  );
}
