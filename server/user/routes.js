'use strict'

const { Router } = require("express");
const CONFIG = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const CONTROLLER = require("./controller");

const { sanitizeData } = require('../libs/sanitize_middleware.js');
const { validateToken, validateOrigin } = require('../libs/request_middleware');

const ROUTER = Router();
const RUNTIME_ENV = CONFIG.runtimeEnv;

ROUTER.post('/authenticate', sanitizeData, validateOrigin, async (req, res) => {
  CONTROLLER.userAuthenticate(req, res);
});

ROUTER.post('/sso', async (req, res) => {
  CONTROLLER.ssoAuthenticate(req, res);
});

if(RUNTIME_ENV == "production") ROUTER.use(validateToken);
ROUTER.get('/validate', async (req, res) => {
  res.send();
});

module.exports = ROUTER;
