"use strict";

const config = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const nodemailer = require("nodemailer");

exports.sendEmail = async (params, body, callback) => {
  try {
    let toList = params.to.toString();
    let transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.emailPort == 465 // true for 465, false for other ports
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: params.from, // sender address
      to: toList, // list of receivers
      subject: params.subject, // Subject line
      html: body // html body
    });

    callback(null, info.messageId);
  }
  catch(error) {
    callback(error, null);
  }
}
