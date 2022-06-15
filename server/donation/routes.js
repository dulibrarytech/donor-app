'use strict'

const { Router } = require("express");
const router = Router();
const donationController = require("./controller");

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

router.post('/', async (req, res) => {
  console.log("POST /donation")
  donationController.donationPost(req, res);
});

router.put('/:id', async (req, res) => {
  console.log("PUT /donation/:id")
  donationController.donationPut(req, res);
});

router.delete('/:id', async (req, res) => {
  console.log("DELETE /donation/:id")
  donationController.donationDelete(req, res);
});

module.exports = router;
