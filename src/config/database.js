/* eslint-disable no-console */

/**
 * Configuration for the database
 */

import mongoose from 'mongoose';

import constants from './constants';

// Remove the warning with Promise
mongoose.Promise = global.Promise;

// If debug run the mongoose debug options
mongoose.set('debug', process.env.MONGOOSE_DEBUG);
mongoose.set('useCreateIndex',true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

try {
  mongoose.connect(constants.MONGO_URL, { useNewUrlParser: true });
} catch (err) {
  mongoose.createConnection(constants.MONGO_URL, { useNewUrlParser: true });
}
mongoose.connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  }); 
