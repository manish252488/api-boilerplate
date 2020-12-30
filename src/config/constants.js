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
  JWT_SECRET: process.env.JWT_SECRET_DEV,
  MONGO_URL: process.env.MONGO_URL_DEV,
};

const mailchimpConfig = {
  MAILCHIMP_KEY: process.env.MAILCHIMP_API_KEY
};
const evernote = {
  evernote: {
    evernoteKey: process.env.EVERNOTE_KEY,
    evernoteSecert: process.env.EVERNOTE_SECRET,
    sandbox: process.env.APP_ENV === "development" ? true : false,
    china: false
  }

}
const flickr = {
  flickerKey: process.env.FLICKR_KEY,
  flickerSecret: process.env.FLICKR_SECRET
}
const testConfig = {
  JWT_SECRET: 'ewtijwebgiuweg9w98u9283982t!!u1h28h1t1h89u9h@$$',
  MONGO_URL: 'mongodb://localhost/nodejs-api-boilerplate-test',
};

const fileEncoding = {
  base64: 'base64'
}

const prodConfig = {
  JWT_SECRET: process.env.JWT_SECRET_PROD,
  MONGO_URL: process.env.MONGO_URL_PROD,
};
const sharefileConfig = {
  clientId: process.env.SHAREFILE_CLIENT_ID,
  clientSecret: process.env.SHAREFILE_CLIENT_SECRET
}
const defaultConfig = {
  PORT: process.env.PORT || 3002,
  RAVEN_ID: process.env.RAVEN_ID,
  WHITELIST,
};
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT,
  api_key: process.env.GOOGLE_API_KEY
}

const letsuploadkeys = {
  key1: process.env.LETSUPLOAD_KEY1,
  key2: process.env.LETSUPLOAD_KEY2
}

const storages = {
  localStorage: "local",
  googleStorage: "googledrive",
  dropboxStorage: "dropbox",
  oneDrive: "onedrive",
  yahooStorage: "yahoo",
  amazonDrive: "awsDrive",
  boxStorage: "box",
  s3Storage: "s3",
  enote: "evernote",
  facebook: "facebook",
  flickr: "flickr",
  shareAnyWhere: "sendAnywhere",
  letsUpload: "letsUpload",
  googlePhotos: "googlephotos",
  filemail: "filemail",
  yandex: "yandex",
  egnyte: "egnyte",
  sharefile: "sharefile",
  nextcloud: "nextcloud",
  zohoDocs: "zohoDocs",
  alibaba: "alibaba",
  idrive: "idrive",
  pcloud: "pcloud",
  sugarsync: "sugarSync",
  syncplicity: "syncplicity",
  koofr: "koofr"

}
const mails = {
  googleMail: "gmail",
  outlookMail: "outlook",
  imap: "imap"
}
const sources = {
  google: "google",
  outlook: "outlook",
  yahoo: "yahoo"
}

const s3Config = {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY_DEV,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY_DEV,
  BUCKET: process.env.BUCKET_DEV,
  BOX_CLIENT_ID: process.env.BOX_CLIENT_ID,
  BOX_CLIENT_SECRET: process.env.BOX_CLIENT_SECRET
};

function getByteValue(value, unit) {
  switch(unit.toLowerCase()) {
    case "kb":
      return value * 1000;
    case "mb":
      return value * (1000 * 1000);
    case "gb":
      return value * (1000 * 1000 * 1000);
  }
}
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
  ...s3Config,
  ...defaultConfig,
  ...googleConfig,
  ...fileEncoding,
  ...mailchimpConfig,
  ...storages,
  ...mails,
  ...evernote,
  ...flickr,
  ...letsuploadkeys,
  source: sources,
  getByteValue,
  ...envConfig(process.env.NODE_ENV),
};
