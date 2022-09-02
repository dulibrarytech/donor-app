'use strict'

const Donation = require("./Donation");
const Service = require("./service");
const JWTHelper = require("../libs/jwt_helper");

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);

exports.donations = (req, res) => {
  Donation.getAllDonations()
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}

exports.donorDonations = (req, res) => {
  let donorId = req.params.donorId ?? "";
  Donation.getDonorDonations(donorId)
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      res.status(500).send(error);
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
      res.status(500).send(error);
    }
  );
}

exports.donationPut = (req, res) => {
  let id = req.params.id ?? "";
  let data = req.body;
  Donation.putDonation(id, data)
  .then(
    function(data) {
      res.send(JSON.stringify(data))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}

exports.donationPost = (req, res) => {
  let data = req.body;
  let token = req.headers['authorization'];

  Donation.postDonation(data)
  .then(
    function(result) {
      let response = {};
      let donationId = result[0]?.insertId || null;
      
      response['emailSent'] = false;
      response['donationId'] = donationId;

      if(config.enableEmailNotifications == "true") {
        Service.sendNewDonationNotifications({...data, donationId}, function(error) {
          if(error) response['message'] = error;
          else response['emailSent'] = true;
          res.send(JSON.stringify(response))
        });
      }
      else {
        response['message'] = "Email notifications are disabled.";
        res.send(JSON.stringify(response));
      }
    },
    function(error) {
      res.status(500).send(error);
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
      res.status(500).send(error);
    }
  );
}

exports.donationLetter = (req, res) => {
  let id = req.params.id ?? "";
  Donation.completeLetter(id)
  .then(
    function(response) {
      res.send(JSON.stringify(response))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}

exports.donationPending = (req, res) => {
  Donation.getPendingDonations()
  .then(
    function(response) {
      res.send(JSON.stringify(response))
    },
    function(error) {
      res.status(500).send(error);
    }
  );
}
