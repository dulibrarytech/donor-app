'use strict'

const { Router } = require("express");
const router = Router();
const donorController = require("../controllers/donorController.js");

router.use((req, res, next) => {
  console.log('donor router: Time: ', Date.now())
  next()
})

router.get('/', async (req, res) => {
    console.log("GET /donors")

}, donorController.donors);

// router.get('/:id', async (req, res) => {
//     console.log("GET /donor")
//
// }, donorController.donorGet);
//
// router.post('/:id', async (req, res) => {
//     console.log("POST /donor")
//
// }, donorController.donorPost);
//
// router.put('/:id', async (req, res) => {
//     console.log("PUT /donor")
//
// }, donorController.donorPut);
//
// router.delete('/:id', async (req, res) => {
//     console.log("DELETE /donor")
//
// }, donorController.donorDelete);

module.exports = router;
