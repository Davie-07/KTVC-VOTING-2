require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  clientOrigin: process.env.CLIENT_ORIGIN || '*'
};

module.exports = env;

