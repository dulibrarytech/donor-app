'use strict'

const { Router } = require("express");
const { runtimeEnv } = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const { sanitizeData } = require('../libs/sanitize_middleware.js');
const { validateToken } = require('../libs/request_middleware');
const donorController = require("./controller");

const router = Router();
if(runtimeEnv == "production") router.use(validateToken);

router.get('/', async (req, res) => {
  donorController.donors(req, res);
});

router.get('/:id', async (req, res) => {
  donorController.donorGet(req, res);
});

router.post('/', sanitizeData, async (req, res) => {
  donorController.donorPost(req, res);
});

router.put('/:id', sanitizeData, async (req, res) => {
  donorController.donorPut(req, res);
});

router.delete('/:id', async (req, res) => {
  donorController.donorDelete(req, res);
});

router.get('/titles/list', async (req, res) => {
  donorController.donorTitlesList(req, res);
});

module.exports = router;
