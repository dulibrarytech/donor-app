/*
 * Donor model
 */

'use strict'

const database = require('../libs/database.js');
const Model = require('../libs/Model.js');

/* {database field} : {response data field} */
module.exports = (() => {
  const map = {
    "donorID":      "id",
    "titleID":      "title",
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
    "anonymous":    "anonymous",
    "Country":      "country"
  }

  const queries = {
    'get_all': `
      SELECT
        Donors.donorID AS       ${map.donorID},
        Titles.title AS         ${map.titleID},
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
      LEFT JOIN tbl_donortitle_lkup Titles ON Donors.titleID=Titles.titleID`,

    'get_donor': `
      SELECT
        Donors.donorID AS       ${map.donorID},
        Titles.titleID AS         ${map.titleID},
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
      LEFT JOIN tbl_donortitle_lkup Titles ON Donors.titleID=Titles.titleID
      WHERE Donors.donorID = ?;`,

    'put_donor': `
      UPDATE tbl_donorinfo Donors
      SET
        titleID = ?,
        FirstName = ?,
        LastName = ?,
        Address1 = ?,
        Address2 = ?,
        City = ?,
        State = ?,
        PostalCode = ?,
        phone = ?,
        email = ?,
        Organization = ?,
        anonymous = ?,
        Country = ?
      WHERE Donors.donorID = ?;`,

    'post_donor': `
      INSERT INTO tbl_donorinfo (
        titleID,
        FirstName,
        LastName,
        Address1,
        Address2,
        City,
        State,
        PostalCode,
        phone,
        email,
        Organization,
        anonymous,
        Country
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`,

    'delete_donor': `
      DELETE FROM tbl_donorinfo WHERE donorID = ?;`,

    'get_titles': `
      SELECT * FROM tbl_donortitle_lkup;`
  }

  const DonorModel = new Model(database, queries);

  const getAllDonors = () => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('get_all')
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error retrieving donors: ${error}`);
          reject(error);
        }
      );
    });
  }

  const getDonor = (id) => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('get_donor', [id])
      .then(
        (response) => {
          if(response.data.length > 0) resolve(response.data[0])
          else resolve({})
        },
        (error) => {
          console.log(`Error retrieving donor: ${error}`);
          reject(error);
        }
      );
    });
  }

  const putDonor = (id, data) => {
    data[map.anonymous] = 0;

    let sqlFields = [
      parseInt(data[map.titleID]) ?? null,
      data[map.FirstName] ?? null,
      data[map.LastName] ?? null,
      data[map.Address1] ?? null,
      data[map.Address2] ?? null,
      data[map.City] ?? null,
      data[map.State] ?? null,
      data[map.PostalCode] ?? null,
      data[map.phone] ?? null,
      data[map.email] ?? null,
      data[map.Organization] ?? "None specified",
      parseInt(data[map.anonymous]) ?? 0,
      data[map.Country] ?? "USA"
    ];

    return new Promise((resolve, reject) => {
      DonorModel.execute_query('put_donor', [...sqlFields, id])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error updating donor: ${error}`);
          reject(error);
        }
      );
    });
  }

  const postDonor = (data) => {
    data[map.anonymous] = 0;

    let sqlFields = [
      data[map.titleID] ?? null,
      data[map.FirstName] ?? null,
      data[map.LastName] ?? null,
      data[map.Address1] ?? null,
      data[map.Address2] ?? null,
      data[map.City] ?? null,
      data[map.State] ?? null,
      data[map.PostalCode] ?? null,
      data[map.phone] ?? null,
      data[map.email] ?? null,
      data[map.Organization] ?? "None specified", // Enforce not null
      data[map.anonymous] ?? 0,
      data[map.Country] ?? "USA"
    ];

    return new Promise((resolve, reject) => {
      DonorModel.execute_query('post_donor', sqlFields)
      .then(
        (response) => {
          console.log("Response data, fields", response.data, sqlFields)
          resolve(response.data)
        },
        (error) => {
          console.log(`Error creating donor record: ${error}`);
          reject(error);
        }
      );
    });
  }

  const deleteDonor = (id) => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('delete_donor', [id])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error deleting donor: ${error}`);
          reject(error);
        }
      );
    });
  }

  const getTitles = () => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('get_titles')
      .then(
        (response) => {
          let titles = [], item;
          for(let index in response.data) {
            item = response.data[index];
            titles.push({
              titleId: item.titleID,
              titleString: item.title
            });
          }
          resolve(titles)
        },
        (error) => {
          console.log(`Error retrieving donor title list: ${error}`);
          reject(error);
        }
      );
    });
  }

  return {
    getAllDonors,
    getDonor,
    putDonor,
    postDonor,
    deleteDonor,
    getTitles
  }
})()
