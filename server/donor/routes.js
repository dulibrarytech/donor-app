'use strict'

const { Router } = require("express");
const { sanitizeData } = require('../libs/sanitize.js');
const donorController = require("./controller");

const router = Router();

router.use((req, res, next) => {
  console.log('/donor router: Time: ', Date.now())
  next();
})

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
