/*
 * User service
 */

'use-strict'

const User = require("./User");

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const email = require('../libs/email_helper');

module.exports = (() => {
  const authServiceUrl = config.authServiceUrl;

  const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
      axios.post(authServiceUrl, {username, password})
      .then(function (response) {
        resolve({isAuthenticated: response.data.auth ?? false})
      })
      .catch(function (error) {reject(error)});
    });
  }

  const getUserEmailList = (roleId) => {
    return new Promise((resolve, reject) => {
      User.getUsersByRole(roleId)
      .then(function (users) {
        let list = [];
        for(let user of users) list.push(user.email);
        resolve(list);
      })
      .catch(function (error) {reject(error)});
    });
  }

  return {
    authenticateUser,
    getUserEmailList
  }
})()
