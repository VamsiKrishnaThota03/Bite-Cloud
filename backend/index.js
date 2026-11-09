const express = require('express');
const cors = require('cors');
const { port, host, corsOrigins } = require('./config');
const mongoDB = require('./db');

const app = express();

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bite-Cloud API is running');
});

app.use('/api', require('./routes/CreateUser'));
app.use('/api', require('./routes/DisplayData'));

mongoDB().then(() => {
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
});
