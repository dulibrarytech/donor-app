'use strict'

const database = require('../libs/database.js');

module.exports = (() => {
  const map = {
    "donorID":      "id",
    "title":        "title",
    "FirstName":    "firstName",
    "LastName":     "lastName",
    "Address1":     "address1",
    "Address2":     "address2",
    "City":         "city",
    "State":        "state",
    "PostalCode":   "postalCode",
    "phone":        "phone",
    "email":        "email",
    "Organization": "organization",
    "Country":      "country"
  }

  const getAllDonors = () => {
    let query = `
      SELECT
        Donors.donorID AS       ${map.donorID},
        Titles.title AS         ${map.title},
        Donors.FirstName AS     ${map.FirstName},
        Donors.LastName AS      ${map.LastName},
        Donors.Address1 AS      ${map.Address1},
        Donors.Address2 AS      ${map.Address2},
        Donors.City AS          ${map.City},
        Donors.State AS         ${map.State},
        Donors.PostalCode AS    ${map.PostalCode},
        Donors.phone AS         ${map.phone},
        Donors.email AS         ${map.email},
        Donors.Organization AS  ${map.Organization},
        Donors.Country AS       ${map.Country}
      FROM tbl_donorinfo Donors
      INNER JOIN tbl_donortitle_lkup Titles ON Donors.titleID=Titles.titleID;`;

    let donors = [];
    return new Promise((resolve, reject) => {
      database.getConnection((error, connection) => {
        try {
          if(error) throw new Error(`Error connecting to database: ${error}`);

          connection.query(query, (error, results, fields) => {
            if(error) {
              reject(error)
            }
            else {
              donors = results;
              resolve(donors);
            }
            connection.release();
          });
        }
        catch(error) {
          reject(`Database error: ${error}`);
        }
      });
    });
  }

  return {
    getAllDonors
  }
})()
