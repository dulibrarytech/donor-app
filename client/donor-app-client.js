require('dotenv').config();
const compress = require('compression');

var express = require('express');
var app = express();

if (process.env.RUNTIME_ENV === 'production') {
  app.use(compress());
}

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.listen(process.env.APP_PORT || 8080, () => {
  console.log(`Donor App Client is running on port ${process.env.APP_PORT} in ${process.env.RUNTIME_ENV} mode`);
})
