const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000
  });
  return mongoose.connection;
}

module.exports = { connectDB };

