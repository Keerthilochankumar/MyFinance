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
 "production": {
   "use_env_variable":"database_url",
   "dialect":"postgres"
  }
};
