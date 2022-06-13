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
    "CDate":              "dateOfRecord",
    "dateOfGift":         "dateOfGift",
    "numberOfGifts":      "numberOfGifts",
    "important":          "important",
    "letter":             "letter",
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
        Gifts.CDate AS                    ${map.CDate},
        Gifts.dateOfGift AS               ${map.dateOfGift},
        Gifts.numberOfGifts AS            ${map.numberOfGifts},
        Gifts.important AS                ${map.important},
        Gifts.letter AS                   ${map.letter},
        Descriptions.giftDescription1 AS  ${map.giftDescription1},
        Descriptions.giftDetails AS       ${map.giftDetails}

      FROM tbl_donorgifts Gifts
      LEFT JOIN tbl_donorgiftdescriptions Descriptions
      ON Gifts.giftsID=Descriptions.giftsID
      INNER JOIN tbl_donorinfo Donors
      ON Gifts.donorID=Donors.donorID;`
  }

  const DonationModel = new Model(database, queries);

  const getAllDonations = () => {
    return new Promise((resolve, reject) => {
      DonationModel.execute_query('get_all')
      .then(
        function(donations) {
          console.log("Donations:", donations)
          resolve(donations)
        },
        function(error) {
          reject(error);
        }
      );
    });
  }

  return {
    getAllDonations
  }
})()
