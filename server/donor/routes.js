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
  console.log("GET /donor")
  donorController.donors(req, res);
});

router.get('/:id', async (req, res) => {
  console.log("GET /donor/:id")
  donorController.donorGet(req, res);
});

router.post('/', sanitizeData, async (req, res) => {
  console.log("POST /donor")
  donorController.donorPost(req, res);
});

router.put('/:id', sanitizeData, async (req, res) => {
  console.log("PUT /donor/:id")
  donorController.donorPut(req, res);
});

router.delete('/:id', async (req, res) => {
  console.log("DELETE /donor/:id")
  donorController.donorDelete(req, res);
});

module.exports = router;
