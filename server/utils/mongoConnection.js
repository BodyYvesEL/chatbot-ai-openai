
const mongoose = require('mongoose');
require('dotenv').config();

const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing database connection
    console.log('Using existing connection');
    return;
  }

  // Create new database connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log('Database connected successfully');
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error('Error connecting to database', error);
  }
}

module.exports = connectDb;


