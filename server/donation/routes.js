'use strict'

const { Router } = require("express");
const { runtimeEnv } = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const { sanitizeData } = require('../libs/sanitize_middleware');
const { validateToken } = require('../libs/request_middleware');
const donationController = require("./controller");

const router = Router();
if(runtimeEnv == "production") router.use(validateToken);

router.get('/', async (req, res) => {
  donationController.donations(req, res);
});

router.get('/donor/:donorId', async (req, res) => {
  donationController.donorDonations(req, res);
});

router.get('/:id', async (req, res) => {
  donationController.donationGet(req, res);
});

router.post('/', sanitizeData, async (req, res) => {
  donationController.donationPost(req, res);
});

router.put('/:id', sanitizeData, async (req, res) => {
  donationController.donationPut(req, res);
});

router.delete('/:id', async (req, res) => {
  donationController.donationDelete(req, res);
});

router.post('/:id/letter', async (req, res) => {
  donationController.donationLetter(req, res);
});

router.get('/pending/all', async (req, res) => {
  donationController.donationPending(req, res);
});

module.exports = router;
