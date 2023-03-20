'use strict'

const CONFIG = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const Service = require("./service");
const User = require("./User");
const JWTHelper = require("../libs/jwt_helper");

exports.userAuthenticate = async (req, res) => {
  let username = req.body.username || "";
  let password = req.body.password || "";
  console.log(`Authenticating user: ${username}`)

  try {
    let response = await Service.authenticateUser(username, password);
    if(response.isAuthenticated === true || CONFIG.runtimeEnv == 'development') {
      response = await User.authorize(username);

      if(response.isAuthorized === true) {
        let userData = (({ roleId, username, firstName, lastName }) => ({ roleId, username, firstName, lastName }))(response.data);
        let token = JWTHelper.createToken(userData);

        let data = {"token": token, "userData": userData};
        console.log("Authentication successful: ", userData.username);
        res.send(JSON.stringify(data))
      }
      else res.status(401).send();
    }
    else res.status(401).send();
  }
  catch(error) {
    console.error(error);
    res.status(500).send();
  }
}

exports.ssoAuthenticate = async (req, res) => {
  let username = req.body.employeeID || "";
  let host = req.body.HTTP_HOST || ""; 
  let path = req.query.path || "";

  try {
    if(host = CONFIG.ssoHost) {
      let response = await User.authorize(username);

      if(response.isAuthorized === true) {
        let userData = (({ roleId, username, firstName, lastName }) => ({ roleId, username, firstName, lastName }))(response.data);
        let token = JWTHelper.createToken(userData);

        let clientLoginUrl = `${CONFIG.ssoClientLoginPath}?token=${token}`;
        if(path) clientLoginUrl += `&redirect=${path}`;
        res.redirect(clientLoginUrl);
      }
      else {
        res.status(401).send();
      }
    }
    else {
      res.status(401).send("Unrecognized authentication identity provider");
    }
  }
  catch(error) {
    console.error(error);
    res.status(500).send();
  }
}

exports.tokenValidate = async (req, res) => {
  let isValid = false;
  let token = req.params.token || null;  
  let data = JWTHelper.verifyToken(token);

	if(data) isValid = true;
	res.send({isValid, data});
}
