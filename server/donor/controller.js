'use strict'

const Donor = require("./Donor");

exports.donors = (req, res) => {
  Donor.getAllDonors()
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
