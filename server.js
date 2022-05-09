const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {port} = require('./config');

const transactionsRoutes = require("./routes/transactions");

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/api/transactions', transactionsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});