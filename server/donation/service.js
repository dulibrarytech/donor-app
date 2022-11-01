/*
 * Donation service
 */
'use-strict'

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const UserService = require("../user/service");
const EmailHelper = require("../libs/email_helper");

const ADMIN_USER = 2;
const EXTREL_USER = 3;

module.exports = (() => {

  const sendNewDonationNotifications = async ({important, donationId, lastName, organization, giftDescription}, callback) => {
    if(!important) {
      console.error(`Can not determine donation type. Notification email not sent. Donation id: ${donationId || "null"}`);
      callback("Can not determine donation type. Notification email not sent.");
    }
    else if(!donationId) {
      console.error(`Null donation id. Notification email not sent.`);
      callback("Null donation id. Notification email not sent.");
    }
    else {
      let roleId = important == 0 ? ADMIN_USER : EXTREL_USER;
      let recipientList = [];

      try{
        recipientList = await UserService.getUserEmailList(roleId);
      } catch(error) { console.log(`Error retrieving email recipients. Email notification not sent. Donation id: ${donationId}`, error) }

      let params = {
        from: "intrazone@du.edu",
        to: recipientList,
        subject: "I5 Donor App New Donation"
      }

      let body =
      `<style>
        h4 {font-size: 18px}
        h5 {font-size: 17px}
        * {font-size: 16px}
      </style>
      <h4>New Donation *** Automated Message, Do Not Reply *** </h4>
      <br>
      <h5>Donor Last Name</h5>
      ${lastName || "None specified"}
      <h5>Organization</h5>
      ${organization || "None specified"}
      <h5>Description</h5>
      ${giftDescription}
      <br>
      <br>
      <br>
      <br>
      <a href=\"${config.emailNotificationLinkDonorAppUrl}/${donationId}">View Donation</a>`;

      EmailHelper.sendEmail(params, body, function(error, messageId) {
        if(error) {
          console.log(`Error sending new donation notification emails, id: ${donationId}, ${error}`);
          callback(error);
        }
        else {
          console.log(`New Donation: id: ${donationId}, Notification(s) sent to ${recipientList.toString()}`);
          console.log(`Message id: ${messageId}`);
          callback(null);
        }
      });
    }
  }

  return {
    sendNewDonationNotifications
  }
})()
