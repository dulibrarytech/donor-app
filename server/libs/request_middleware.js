'use strict'

const jwt = require('jsonwebtoken');
const {tokenKey, corsAllowedOrigin} = require(`../../config/${process.env.CONFIGURATION_FILE}`);

exports.validateToken = (req, res, next) => {
  let token = req.headers["authorization"] || null;
  if(token && token.length > 0) {
    jwt.verify(token, tokenKey, function(err, decoded) {
      if(err) {
        console.log(`Session token invalid. Token: ${token} Error: ${err}`);
        res.status(401).send("Unauthorized")
      }
      else {
        // TODO: If refresh, extract data and create new token here. Attach to 'authorization' header in response here
        next();
      }
    });
  }
  else {
    res.status(401).send("Unauthorized");
  }
}

exports.validateOrigin = (req, res, next) => {
  if(req.headers.origin == corsAllowedOrigin) next();
  else res.status(403).send("Forbidden");
}
