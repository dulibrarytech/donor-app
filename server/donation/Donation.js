/*
 * Donation model
 */

'use strict'

const database = require('../libs/database.js');
const Model = require('../libs/Model.js');

/* {database field} : {response data field} */
module.exports = (() => {
  const map = {
    "giftsID":            "id",
    "donorID":            "donorId",
    "FirstName":          "firstName",
    "LastName":           "lastName",
    "Organization":       "organization",
    "Cdate":              "dateOfRecord",
    "dateOfGift":         "dateOfGift",
    "numberOfGifts":      "numberOfGifts",
    "important":          "important",
    "letter":             "letter",
    "bypassLetter":       "bypassLetter",
    "giftDescription1":   "giftDescription",
    "giftDetails":        "giftDetails",
  }

  const queries = {
    'get_all': `

      SELECT
        Gifts.giftsID AS                  ${map.giftsID},
        Gifts.donorID AS                  ${map.donorID},
        Donors.FirstName AS               ${map.FirstName},
        Donors.LastName AS                ${map.LastName},
        Donors.Organization AS            ${map.Organization},
        Gifts.Cdate AS                    ${map.Cdate},
        Gifts.dateOfGift AS               ${map.dateOfGift},
        Gifts.numberOfGifts AS            ${map.numberOfGifts},
        Gifts.important AS                ${map.important},
        Gifts.letter AS                   ${map.letter},
        Gifts.bypassLetter AS             ${map.bypassLetter},
        Descriptions.giftDescription1 AS  ${map.giftDescription1},
        Descriptions.giftDetails AS       ${map.giftDetails}

      FROM tbl_donorgifts Gifts
      LEFT JOIN tbl_donorgiftdescriptions Descriptions
      ON Gifts.giftsID=Descriptions.giftsID
      INNER JOIN tbl_donorinfo Donors
      ON Gifts.donorID=Donors.donorID;`,

      'get_donor_donations': `
        SELECT
          Gifts.giftsID AS                  ${map.giftsID},
          Gifts.Cdate AS                    ${map.Cdate},
          Gifts.dateOfGift AS               ${map.dateOfGift},
          Gifts.numberOfGifts AS            ${map.numberOfGifts},
          Gifts.important AS                ${map.important},
          Gifts.letter AS                   ${map.letter},
          Gifts.bypassLetter AS             ${map.bypassLetter},
          Descriptions.giftDescription1 AS  ${map.giftDescription1},
          Descriptions.giftDetails AS       ${map.giftDetails}

          FROM tbl_donorgifts Gifts
          LEFT JOIN tbl_donorgiftdescriptions Descriptions
          ON Gifts.giftsID=Descriptions.giftsID
          WHERE Gifts.donorID = ?;`,

      'get_donation': `
        SELECT
          Gifts.giftsID AS                  ${map.giftsID},
          Gifts.donorID AS                  ${map.donorID},
          Donors.FirstName AS               ${map.FirstName},
          Donors.LastName AS                ${map.LastName},
          Donors.Organization AS            ${map.Organization},
          Gifts.Cdate AS                    ${map.Cdate},
          Gifts.dateOfGift AS               ${map.dateOfGift},
          Gifts.numberOfGifts AS            ${map.numberOfGifts},
          Gifts.important AS                ${map.important},
          Gifts.letter AS                   ${map.letter},
          Gifts.bypassLetter AS             ${map.bypassLetter},
          Descriptions.giftDescription1 AS  ${map.giftDescription1},
          Descriptions.giftDetails AS       ${map.giftDetails}

        FROM tbl_donorgifts Gifts
        LEFT JOIN tbl_donorgiftdescriptions Descriptions
        ON Gifts.giftsID=Descriptions.giftsID
        INNER JOIN tbl_donorinfo Donors
        ON Gifts.donorID=Donors.donorID
        WHERE Gifts.giftsID = ?;`,

      'put_donation': `
        UPDATE tbl_donorgifts Gifts
        SET
          dateOfGift = ?,
          numberOfGifts = ?,
          important = ?,
          letter = ?,
          bypassLetter = ?
        WHERE Gifts.giftsId = ?;

        UPDATE tbl_donorgiftdescriptions Descriptions
        SET
          giftDescription1 = ?,
          giftDetails = ?
        WHERE Descriptions.giftsId = ?;`,

      'post_donation': `
        INSERT INTO tbl_donorgifts (
          donorID,
          Cdate,
          dateOfGift,
          numberOfGifts,
          important,
          letter,
          bypassLetter
        )
        VALUES (?,?,?,?,?,?,?);

        INSERT INTO tbl_donorgiftdescriptions (
          giftsID,
          giftDescription1,
          giftDetails
        )
        VALUES ((SELECT MAX( giftsID ) FROM tbl_donorgifts),?,?);`,

      'delete_donation': `
        DELETE FROM tbl_donorgifts WHERE giftsID = ?;
        DELETE FROM tbl_donorgiftdescriptions WHERE giftsID = ?;`
  }

  const DonationModel = new Model(database, queries);

  const getAllDonations = () => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('get_all')
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error retrieving donations: ${error}`);
          reject(error);
        }
      );
    });
  }

  const getDonorDonations = (donorId) => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('get_donor_donations', [donorId])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error retrieving donor donations: ${error}`);
          reject(error);
        }
      );
    });
  }

  const getDonation = (id) => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('get_donation', [id])
      .then(
        (response) => {
          console.log("Direct response from DB:", response)
          if(response.data.length > 0) resolve(response.data[0])
          else resolve({})
        },
        (error) => {
          console.log(`Error retrieving donation: ${error}`);
          reject(error);
        }
      );
    });
  }

  const putDonation = (id, data) => {
    // Default values
    data[map.bypassLetter] = 0;

    // tbl_donorgifts fields
    let giftFields = [
      data[map.dateOfGift],
      parseInt(data[map.numberOfGifts]),
      parseInt(data[map.important]),
      parseInt(data[map.letter]),
      parseInt(data[map.bypassLetter])
    ]

    // tbl_donorgiftdescriptions fields
    let giftDescriptionsFields = [
      data[map.giftDescription1],
      data[map.giftDetails],
    ]

    console.log("DB giftFields:", giftFields)
    console.log("DB giftDescriptionsFields:", giftDescriptionsFields)

    return new Promise((resolve, reject) => {
      DonationModel.execute_query('put_donation', [...giftFields, id, ...giftDescriptionsFields, id])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error updating donation: ${error}`);
          reject(error);
        }
      );
    });
  }

  const postDonation = (data) => {
    // Default values
    data[map.letter] = 1;
    data[map.bypassLetter] = 0;

    // tbl_donorgifts field data
    let giftFields = [
      parseInt(data[map.donorID]),
      new Date().toISOString().slice(0, 10), // TODO: New date assigned here
      data[map.dateOfGift],
      parseInt(data[map.numberOfGifts]),
      parseInt(data[map.important]),
      parseInt(data[map.letter]),
      0 // bypassLetter default value
    ]

    // tbl_donorgiftdescriptions field data
    let giftDescriptionsFields = [
      data[map.giftDescription1],
      data[map.giftDetails],
    ]

    return new Promise((resolve, reject) => {
      DonationModel.execute_query('post_donation', [...giftFields, ...giftDescriptionsFields])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error creating donation record: ${error}`);
          reject(error);
        }
      );
    });
  }

  const deleteDonation = (id) => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('delete_donation', [id])
      .then(
        (response) => {
          resolve(response.data)
        },
        (error) => {
          console.log(`Error deleting donation: ${error}`);
          reject(error);
        }
      );
    });
  }

  return {
    getAllDonations,
    getDonorDonations,
    getDonation,
    putDonation,
    postDonation,
    deleteDonation
  }
})()
