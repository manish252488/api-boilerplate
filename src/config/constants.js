require('dotenv').config();

const WHITELIST = {
  users: {
    create: [
      'name',
      'email',
      'password',
      'status',
      'source',
      'createdDate',
      'updatedDate',
      'lastLogin']
  },
  transactions: {
    create: [
      'fileNames',
      'fromMailIds',
      'mailDate',
      'fileTypes',
      'downloadSize',
      'saveLocation',
      'mailAccount',
      'termsAcceptDate',
      'localTimestamp',
      'deviceDetail'
    ]
  }
}

const devConfig = {
  MONGO_URL: process.env.MONGO_DEV,
  JWT_SECRET: process.env.JWT_SECRET_DEV,
  API_KEY: process.env.API_KEY_DEV
};
const testConfig = {
  MONGO_URL: process.env.MONGO_TEST,
  JWT_SECRET: process.env.JWT_SECRET_TEST,
  API_KEY: process.env.API_KEY_TEST
};
const prodConfig = {
  MONGO_URL: process.env.MONGO_PROD,
  JWT_SECRET: process.env.JWT_SECRET_PROD,
  API_KEY: process.env.API_KEY_PROD
};
const defaultConfig = {
  PORT: process.env.PORT || 3002,
  WHITELIST,
};


function envConfig(env) {
  switch(env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...devConfig,
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
