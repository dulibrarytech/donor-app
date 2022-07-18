'use strict'

const { Router } = require("express");
const { sanitizeData } = require('../libs/sanitize.js');
const { validateToken } = require('../libs/validateToken');
const userController = require("./controller");

const router = Router();

router.post('/authenticate', sanitizeData, async (req, res) => {
  userController.userAuthenticate(req, res);
});

router.get('/validate', validateToken, async (req, res) => {
  res.send();
});

module.exports = router;
