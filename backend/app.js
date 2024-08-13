const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./models');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
