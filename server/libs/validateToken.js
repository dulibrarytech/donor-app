'use strict'

const jwt = require('jsonwebtoken');
const {tokenKey} = require(`../../config/${process.env.CONFIGURATION_FILE}`);

exports.validateToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if(token) {
    jwt.verify(token, tokenKey, function(err, decoded) {
      if(err) {
        console.log("Session token invalid:", err)
        res.status(401).send("Unauthorized")
      }
      else {
        next();
      }
    });

    // TODO: If refreshed, use data = await verify(), then create new token with data and current stamp. Config->timeToExpire
    // OR create token with current data in nested callback
  }
  else {
    res.status(401).send("Unauthorized");
  }
}
