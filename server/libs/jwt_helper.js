/*
 * User service
 */

'use-strict'

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const jwt = require('jsonwebtoken');

const tokenKey = config.tokenKey;
const jwtExpirySeconds = config.sessionTokenDuration;

exports.createToken = (data) => {
  const token = jwt.sign(data, tokenKey, {
    expiresIn: jwtExpirySeconds
  });
  return token;
}

exports.getTokenData = (token) => {
  return jwt.decode(token);
}
