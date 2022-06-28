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
          Cdate = ?,
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
    data[map.bypassLetter] = 0;

    let giftFields = [
      data[map.Cdate],
      data[map.dateOfGift],
      parseInt(data[map.numberOfGifts]),
      parseInt(data[map.important]),
      parseInt(data[map.letter]),
      parseInt(data[map.bypassLetter])
    ]

    let giftDescriptionsFields = [
      data[map.giftDescription1],
      data[map.giftDetails],
    ]

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
    data[map.bypassLetter] = 0;

    let giftFields = [
      parseInt(data[map.donorID]),
      data[map.Cdate],
      data[map.dateOfGift],
      parseInt(data[map.numberOfGifts]),
      parseInt(data[map.important]),
      parseInt(data[map.letter]),
      parseInt(data[map.bypassLetter])
    ]

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
