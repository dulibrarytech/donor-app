'use strict'

const { Router } = require("express");
const { runtimeEnv } = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const { sanitizeData } = require('../libs/sanitize_middleware.js');
const { validateToken, validateOrigin } = require('../libs/request_middleware');
const userController = require("./controller");

const router = Router();

router.post('/authenticate', sanitizeData, validateOrigin, async (req, res) => {
  userController.userAuthenticate(req, res);
});

if(runtimeEnv == "production") router.use(validateToken);
router.get('/validate', async (req, res) => {
  res.send();
});

module.exports = router;
