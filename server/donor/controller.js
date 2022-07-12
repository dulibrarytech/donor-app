'use strict'

const Donor = require("./Donor");

exports.donors = (req, res) => {
  Donor.getAllDonors()
  .then(
    function(data) {
      res.send(JSON.stringify(data));
    },
    function(error) {
      res.status(500).send(error);
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
      res.status(500).send(error);
    }
  );
}

exports.donorPut = (req, res) => {
  let id = req.params.id ?? "";
  let data = req.body;
  Donor.putDonor(id, data)
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}

exports.donorPost = (req, res) => {
  let data = req.body;
  Donor.postDonor(data)
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      res.status(500).send(error);
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
      res.status(500).send(error);
    }
  );
}

exports.donorTitlesList = (req, res) => {
  Donor.getTitles()
  .then(
    function(response) {
      res.send(JSON.stringify(response))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}
