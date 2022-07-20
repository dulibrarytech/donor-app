'use strict'

const Service = require("./service");
const User = require("./User");

exports.userAuthenticate = async (req, res) => {
  let username = req.body.username || "";
  let password = req.body.password || "";
  console.log(`Authenticating user: ${username}, ${password}`)

  try {
    let response = await Service.authenticateUser(username, password);

    if(response.isAuthenticated === true) {
      response = await User.authorize(username);

      if(response.isAuthorized === true) {
        let userData = (({ roleId, username, firstName, lastName }) => ({ roleId, username, firstName, lastName }))(response.data);
        let token = Service.createToken(userData);

        // res.cookie('token', token);
        // res.cookie('userData', response.data);

        let data = {"token": token, "userData": userData};
        console.log("Authentication successful: ", userdata);
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
