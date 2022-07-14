'use strict'

const { Router } = require("express");
const { sanitizeData } = require('../libs/sanitize.js');
const userController = require("./controller");

const router = Router();

router.post('/authenticate', sanitizeData, async (req, res) => {
  console.log("GET /authenticate", req.body)
  userController.userAuthenticate(req, res);
});

module.exports = router;
