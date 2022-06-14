'use strict'

const Donation = require("./Donation");

exports.donations = (req, res) => {
  Donation.getAllDonations()
  .then(
    function(data) {
      console.log("C Rx data:", data)
      res.send(JSON.stringify(data))
    },
    function(error) {
      console.error(error)
      res.sendStatus(500)
    }
  );
}

exports.donationGet = (req, res) => {
  let id = req.params.id ?? "";
  Donation.getDonation(id)
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

exports.donationPut = (req, res) => {
  let id = req.params.id ?? "";
  let data = req.body;

  console.log("Put Donor C: id: body:", id, data)

  Donation.putDonation(id, data)
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

exports.donationPost = (req, res) => {
  let data = req.body;

  console.log("Post Donor C: body:", data)

  Donation.postDonation(data)
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

exports.donationDelete = (req, res) => {
  let id = req.params.id ?? "";
  Donation.deleteDonation(id)
  .then(
    function(response) {
      res.send(JSON.stringify(response))
    },
    function(error) {
      console.error(error)
      res.sendStatus(500)
    }
  );
}
