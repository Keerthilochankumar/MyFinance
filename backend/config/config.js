require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

module.exports = {
  development: {
    url: dbUrl,
    dialect: 'postgres',
  },
  test: {
    url: dbUrl,
    dialect: 'postgres',
  },
  production: {
    url: dbUrl,
    dialect: 'postgres',
  },
};
