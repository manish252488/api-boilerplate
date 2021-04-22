require("dotenv").config();

const devConfig = {
  MONGO_URL: process.env.MONGO_DEV,
  JWT_SECRET: process.env.JWT_SECRET_DEV,
  API_KEY: process.env.API_KEY_DEV,
};
const testConfig = {
  MONGO_URL: process.env.MONGO_TEST,
  JWT_SECRET: process.env.JWT_SECRET_TEST,
  API_KEY: process.env.API_KEY_TEST,
};
const prodConfig = {
  MONGO_URL: process.env.MONGO_PROD,
  JWT_SECRET: process.env.JWT_SECRET_PROD,
  API_KEY: process.env.API_KEY_PROD,
};
const defaultConfig = {
  PORT: process.env.PORT || 3002,
};

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
};

function envConfig(env) {
  switch (env) {
    case "development":
      return devConfig;
    case "test":
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...devConfig,
  ...defaultConfig,
  google: google,
  ...envConfig(process.env.NODE_ENV),
};
