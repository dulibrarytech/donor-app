'use strict'

const Service = require("./service");
const User = require("./User");

exports.userAuthenticate = async (req, res) => {
  let username = req.body.username || "";
  let password = req.body.password || "";

  console.log("Params rx:", username, password)

  try {
    let response = await Service.authenticateUser(username, password);
    console.log("User service response:", response)

    if(response.isAuthenticated === true) {
      response = await User.authorize(username);
      console.log("User model response:", response)

      if(response.isAuthorized === true) {
        let token = Service.createToken(response.data);
        let data = {"token": token, "userData": response.data};
        console.log("Data payload to client:", data)
        res.send(JSON.stringify(data))
      }
      else res.status(403).send();
    }
    else res.status(403).send();
  }
  catch(error) {
    res.status(500).send(error);
  }
}
