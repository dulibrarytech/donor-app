'use strict'

const { Router } = require("express");
const { sanitizeData } = require('../libs/sanitize.js');
const donationController = require("./controller");

const router = Router();

router.use((req, res, next) => {
  console.log('/donation router: Time: ', Date.now())
  next();
})

router.get('/', async (req, res) => {
  console.log("GET /donation")
  donationController.donations(req, res);
});

router.get('/donor/:donorId', async (req, res) => {
  console.log("GET /donation/donor/:donorId")
  donationController.donorDonations(req, res);
});

router.get('/:id', async (req, res) => {
  console.log("GET /donation/:id")
  donationController.donationGet(req, res);
});

router.post('/', sanitizeData, async (req, res) => {
  console.log("POST /donation")
  donationController.donationPost(req, res);
});

router.put('/:id', sanitizeData, async (req, res) => {
  console.log("PUT /donation/:id")
  donationController.donationPut(req, res);
});

router.delete('/:id', async (req, res) => {
  console.log("DELETE /donation/:id")
  donationController.donationDelete(req, res);
});

router.post('/:id/letter', async (req, res) => {
  console.log("POST /donation/:id/letter")
  donationController.donationLetter(req, res);
});

module.exports = router;
