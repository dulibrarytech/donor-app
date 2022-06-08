'use strict'

const Donors = require("../models/Donors.js");

exports.donors = (req, res) => {
  res.send(JSON.stringify(Donors.getAllDonors()))
}
