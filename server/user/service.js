/*
 * User service
 */

'use-strict'

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const jwt = require('jsonwebtoken');

module.exports = (() => {
  const authServiceUrl = config.authServiceUrl;
  const tokenKey = config.tokenKey;
  const jwtExpirySeconds = config.sessionTokenDuration;

  const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
      let body = {
        method: "post",
        body: JSON.stringify({username, password}),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      fetch(authServiceUrl, body)
        .then(response => response.json())
        .then(data => {
          let response = {
            isAuthenticated: data.auth
          }
          resolve(response)
        })
        .catch(error => {
          console.log("Authentication error:", error)
          reject(error);
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
