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
      INNER JOIN tbl_donortitle_lkup Titles ON Donors.titleID=Titles.titleID;`,

    'get_donor': `
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
      INNER JOIN tbl_donortitle_lkup Titles ON Donors.titleID=Titles.titleID
      WHERE Donors.donorID = ?`,

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
      DELETE FROM tbl_donorinfo WHERE donorID = ?;`
  }

  const DonorModel = new Model(database, queries);

  const getAllDonors = () => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('get_all')
      .then(
        (response) => {
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const getDonor = (id) => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('get_donor', [id])
      .then(
        (response) => {
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const putDonor = (id, data) => {
    data[map.anonymous] = 0;

    let sqlFields = [
      data[map.titleID],
      data[map.FirstName],
      data[map.LastName],
      data[map.Address1],
      data[map.Address2],
      data[map.City],
      data[map.State],
      data[map.PostalCode],
      data[map.phone],
      data[map.email],
      data[map.Organization],
      data[map.anonymous],
      data[map.Country]
    ]
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('put_donor', [...sqlFields, id])
      .then(
        (response) => {
          // Check if affected rows is 1
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const postDonor = (data) => {
    data[map.anonymous] = 0;

    let sqlFields = [
      data[map.titleID],
      data[map.FirstName],
      data[map.LastName],
      data[map.Address1],
      data[map.Address2],
      data[map.City],
      data[map.State],
      data[map.PostalCode],
      data[map.phone],
      data[map.email],
      data[map.Organization],
      data[map.anonymous],
      data[map.Country]
    ]
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('post_donor', sqlFields)
      .then(
        (response) => {
          // TODO check for insert id
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const deleteDonor = (id) => {
    return new Promise((resolve, reject) => {
      DonorModel.execute_query('delete_donor', [id])
      .then(
        (response) => {
          // TODO check if affected rows is 1. First test array/object?
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  return {
    getAllDonors,
    getDonor,
    putDonor,
    postDonor,
    deleteDonor
  }
})()
