/*
 * User service
 */

'use-strict'

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

module.exports = (() => {
  const authServiceUrl = config.authServiceUrl;
  const tokenKey = config.tokenKey;
  const jwtExpirySeconds = config.sessionTokenDuration;

  const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
      axios.post(authServiceUrl, {username, password})
      .then(function (response) {
        resolve({isAuthenticated: response.data.auth ?? false})
      })
      .catch(function (error) {
        reject(error)
      });
    });
  }

  const createToken = (data) => {
    const token = jwt.sign(data, tokenKey, {
  		expiresIn: jwtExpirySeconds
  	});
    return token;
  }

  return {
    authenticateUser,
    createToken
  }
})()
