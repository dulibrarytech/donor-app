'use strict'

const {runtimeEnv} = require(`../../config/${process.env.CONFIGURATION_FILE}`);
const Service = require("./service");
const User = require("./User");
const JWTHelper = require("../libs/jwt_helper");

exports.userAuthenticate = async (req, res) => {
  let username = req.body.username || "";
  let password = req.body.password || "";
  console.log(`Authenticating user: ${username}`)

  try {
    let response = await Service.authenticateUser(username, password);
    if(response.isAuthenticated === true || runtimeEnv == 'development') {
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
    res.status(500).send(error);
  }
}
