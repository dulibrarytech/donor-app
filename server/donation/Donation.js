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
          console.log("all Donations:", response)
          // TODO: Updates for Model response objecr
          //resolve(response.data)
          resolve(donations)
        },
        (error) => {
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
          console.log("get Donation:", response)
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const putDonation = (id, data) => {
    data[map.bypassLetter] = 0;

    let giftFields = [
      data[map.Cdate],
      data[map.dateOfGift],
      data[map.numberOfGifts],
      data[map.important],
      data[map.letter],
      data[map.bypassLetter]
    ]

    let giftDescriptionsFields = [
      data[map.giftDescription1],
      data[map.giftDetails],
    ]

    return new Promise((resolve, reject) => {
      DonationModel.execute_query('put_donation', [...giftFields, id, ...giftDescriptionsFields, id])
      .then(
        (response) => {
          // Check if affected rows is 1
          console.log("put Donation:", response)
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const postDonation = (data) => {
    console.log("Data in:", data)
    data[map.bypassLetter] = 0;

    let giftFields = [
      data[map.donorID],
      data[map.Cdate],
      data[map.dateOfGift],
      data[map.numberOfGifts],
      data[map.important],
      data[map.letter],
      data[map.bypassLetter]
    ]

    console.log("giftFields:", giftFields)

    let giftDescriptionsFields = [
      data[map.giftDescription1],
      data[map.giftDetails],
    ]
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('post_donation', [...giftFields, ...giftDescriptionsFields])
      .then(
        (response) => {
          // TODO check for insert id
          console.log("post Donation:", response)
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  const deleteDonation = (id) => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('delete_donation', [id])
      .then(
        (response) => {
          // TODO check if affected rows is 1. First test array/object?
          console.log("delete Donation:", response)
          resolve(response)
        },
        (error) => reject(error)
      );
    });
  }

  return {
    getAllDonations,
    getDonation,
    putDonation,
    postDonation,
    deleteDonation
  }
})()
