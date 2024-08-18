const { Sequelize } = require('sequelize');
const config = require('../config/config.js'); // Make sure this path is correct

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
    dialect: dbConfig.dialect,
  });
} else {
  sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
  });
}

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize),
  Transaction: require('./transaction')(sequelize, Sequelize),
  Bill: require('./bill')(sequelize, Sequelize),
  Saving: require('./saving')(sequelize, Sequelize),
};

// Check if the connection is successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = db;
