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

exports.donorGet = (req, res) => {
  let id = req.params.id ?? "";
  Donor.getDonor(id)
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

exports.donorPut = (req, res) => {
  let id = req.params.id ?? "";
  let data = req.body;

  console.log("Put Donor C: id: body:", id, data)

  Donor.putDonor(id, data)
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

exports.donorPost = (req, res) => {
  let data = req.body;

  console.log("Post Donor C: body:", data)

  Donor.postDonor(data)
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

exports.donorDelete = (req, res) => {
  let id = req.params.id ?? "";
  Donor.deleteDonor(id)
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
