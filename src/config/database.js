/* eslint-disable no-console */

/**
 * Configuration for the database
 */

import chalk from 'chalk';
import mongoose from 'mongoose';

import constants from './constants';

// Remove the warning with Promise
mongoose.Promise = global.Promise;

// If debug run the mongoose debug options
mongoose.set('debug', process.env.MONGOOSE_DEBUG);
mongoose.set('useCreateIndex',true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
try {
  mongoose.connect(constants.MONGO_URL);
} catch (err) {
  mongoose.createConnection(constants.MONGO_URL);
}
mongoose.connection
  .once('open', () => console.log(chalk.green('MongoDB Running')))
  .on('error', e => {
    throw e;
  }); 
