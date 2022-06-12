'use strict'

const Donation = require("./Donation");

exports.donations = (req, res) => {
  Donation.getAllDonations()
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
