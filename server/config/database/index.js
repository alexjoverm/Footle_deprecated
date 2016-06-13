const mongoose  = require('mongoose');

module.exports = () => {
  require('dotenv').config();

  // Use native promises
  mongoose.Promise = global.Promise;

  // Connect to database
  const url = `${process.env.MONGO_HOST}footle_${process.env.NODE_ENV}`;
  mongoose.connect(url, (err) => {
    if (err) {
      console.log(`===>  Error connecting to ${url}`);
      console.log(`Reason: ${err}`);
    } else {
      console.log(`===>  Succeeded in connecting to ${url}`);
    }
  });
};
