'use strict'

const { Router } = require("express");
const database = require('../libs/database.js');
const router = Router();

const Transaction = require("../models/Transaction");
const transactionModel = new Transaction(database);

router.get('/', async (req, res) => {
    console.log("GET /")
    try {
        const transactions = await transactionModel.find();
        if(!transactions) {
            throw new Error("No transactions");
        }
        res.status(200).json(transactions);
    }
    catch(error) {
        res.status(400).json( {message: error.message} );
    }
});

router.post('/', async (req, res) => {
    let data = req.body;
    console.log("POST, Data:", data)

    for(var key in data) {
        // Sanitize input html entities, <>
    }

    try {
        const transaction = await transactionModel.save(data);
        if(!transaction) {
            throw new Error("There was an error saving the transaction");
        }
        res.status(200).json(transaction);
    }
    catch(error) {
        res.status(500).json( {message: error.message} )
    }
});

module.exports = router;