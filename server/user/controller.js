'use strict'

const Service = require("./service");
const User = require("./User");

exports.userAuthenticate = async (req, res) => {
  let username = req.body.username || "";
  let password = req.body.password || "";

  try {
    let response = await Service.authenticateUser(username, password);

    if(response.isAuthenticated === true) {
      response = await User.authorize(username);

      if(response.isAuthorized === true) {
        let token = Service.createToken(response.data);
        // TODO: if (token == null) throw "Error generating session token";

        // res.cookie('token', token);
        // res.cookie('userData', response.data);
        
        let data = {"token": token, "userData": response.data};
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
