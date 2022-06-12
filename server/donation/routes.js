'use strict'

const { Router } = require("express");
const router = Router();
const donationController = require("./controller");

router.use((req, res, next) => {
  console.log('/donation router: Time: ', Date.now())
  next();
})

router.get('/', async (req, res) => {
    donationController.donations(req, res);
});

module.exports = router;
