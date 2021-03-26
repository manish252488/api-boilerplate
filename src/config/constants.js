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
  JWT_SECRET: 'ewtijwebgiuweg9w98u9283982t!!u1h28h1t1h89u9h@$$',
  MONGO_URL: 'mongodb+srv://manish252488:manish252488@chat-app.z9pvl.mongodb.net/Test?retryWrites=true&w=majority',
};


const testConfig = {
  JWT_SECRET: 'ewtijwebgiuweg9w98u9283982t!!u1h28h1t1h89u9h@$$',
  MONGO_URL: 'mongodb+srv://manish252488:manish252488@chat-app.z9pvl.mongodb.net/Test?retryWrites=true&w=majority',
};


const prodConfig = {
  JWT_SECRET: 'ewtijwebgiuweg9w98u9283982t!!u1h28h1t1h89u9h@$$',
  MONGO_URL: 'mongodb+srv://manish252488:manish252488@chat-app.z9pvl.mongodb.net/Test?retryWrites=true&w=majority',
};
const defaultConfig = {
  PORT: process.env.PORT || 3002,
  RAVEN_ID: process.env.RAVEN_ID,
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
