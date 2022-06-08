'use strict'

const Donors = require("../models/Donors.js");

exports.donors = (req, res) => {
  Donors.getAllDonors()
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      console.log(error)
      res.sendStatus(500)
    }
  );
}
