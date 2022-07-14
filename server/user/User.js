/*
 * User model
 */

'use strict'

const database = require('../libs/database.js');
const Model = require('../libs/Model.js');

/* {database field} : {response data field} */
module.exports = (() => {
  const map = {
    "userID": "userId",
    "username": "username",
    "roleID": "roleId",
    "firstname": "firstName",
    "lastname": "lastName",
    "email": "email"
  }

  const queries = {
    'get_user_by_username': `
      SELECT
        Users.userID AS ${map.userID},
        Users.username AS ${map.username},
        Users.roleID AS ${map.roleID},
        Users.firstname AS ${map.firstname},
        Users.lastname AS ${map.lastname},
        Users.email AS ${map.email}
      FROM tbl_donorusers Users
      WHERE Users.username = ?`
  }

  const UserModel = new Model(database, queries);

  const authorize = (username) => {
    return new Promise((resolve, reject) => {
      UserModel.execute_query('get_user_by_username', [username])
      .then(
        (response) => {
          if(response.data[0]) {
            resolve({isAuthorized: true, data: response.data[0]});
          }
          else {
            resolve({isAuthorized: false, data: null});
          }
        },
        (error) => {
          console.log(`Error retrieving user data: ${error}`);
          reject(error);
        }
      );
    });
  }

  return {
    authorize
  }
})()
