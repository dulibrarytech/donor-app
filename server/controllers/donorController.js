'use strict'

const Donors = require("../models/Donors.js");

exports.donors = (req, res) => {
  console.log("Donor C donors: req.h/res.h", req.headers, res.headers)
  res.send("OK")
  //res.send(JSON.stringify(Donors.getAllDonors()))
}

// module.exports = function() {
//
//   const donors = (req, res) => {
//     console.log("Donor C donorAll", req)
//     res.send(JSON.stringify(Donors.getAllDonors()))
//   }
//
//   return {
//     donors
//   }
// }
