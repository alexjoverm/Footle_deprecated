import mongoose from 'mongoose';

export default () => {
  // Use native promises
  mongoose.Promise = global.Promise;

  // Connect to database
  mongoose.connect(process.env.MONGO_HOST, (err) => {
    if (err) {
      console.log(`===>  Error connecting to ${db}`);
      console.log(`Reason: ${err}`);
    } else {
      console.log(`===>  Succeeded in connecting to ${db}`);
    }
  });
};