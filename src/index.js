/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express';
import chalk from 'chalk';
import './config/database';
import middlewaresConfig from './config/middlewares';
import ApiRoutes from './routes';
import { Response } from './models/response.model';
import http from 'http';
import https from 'https';
import expressSession from 'express-session'
import fs from 'fs';
var cors = require('cors');
import axios from 'axios';
import * as Sentry from '@sentry/node';
import passport from './config/AuthMiddlewares';
import constants from './config/constants';

// import {ipMiddleware} from './config/middlewares'
const app = express();
app.use(cors({ origin: true, credentials: true }));
middlewaresConfig(app);
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', ApiRoutes);


// helper responses
app.response.success = function (message, data, displayMessage, code) {
  console.log(chalk.green(message));
  this
    .status(200)
    .send(Response('success', message, data, displayMessage, code));
}

app.response.error = function (message, data, displayMessage, code) {
  console.log(chalk.red(message));
  if (data) {
    console.log(chalk.red(data));
  }
  message = typeof message != 'string' ? 'Something went wrong' : message;
  this
    .status(200)
    .send(Response('error', message, data, displayMessage, code));
}

app.response.unauthorizedUser = function () {
  console.log(chalk.yellow('Unauthorized User'));
  this
    .status(403)
    .send(Response('error', 'Unauthorized User', null, null, 403));
}

app.response.accessDenied = function () {
  console.log(chalk.cyan('Access Denied. Check role of User and RBAC list'));
  this
    .status(200)
    .send(Response('error', 'Access Denied', null, null, 500));
  console.log(chalk.bgCyan(chalk.black("Exited with Error response because user dont have to permission to access this module\n")));
}

app.response.mime = function (readstream) {
  readstream.pipe(this);
};
// end helper responses
// 0000_csr-certbot.pem
let server;
if (process.env.APP_ENV === 'production') {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/attachimp.com/privkey.pem', 'utf-8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/attachimp.com/fullchain.pem', 'utf-8')
  };
  server = https.createServer(options, app)
} else {
  server = http.createServer(app);
}
let port = process.env.PORT || 3001;
server.listen(port);
server.timeout = 120 * 60 * 1000;
server.on('listening', () => console.log(chalk.blue(chalk.bold(`Started http server listening on port ${port}`))));
server.on('error', err => {
  console.log(chalk.bgRed('Error starting server'));
  console.log(chalk.red(err));
  console.log(chalk.bgRed(chalk.bold(chalk.yellow("Resolve the issues and restart server again"))));
});

axios.interceptors.request.use(request => {
  console.log('AXIOS Starting Request', request)
  return request
})

axios.interceptors.response.use(response => {
  console.log('AXIOS Response:', response.data)
  return response
})
export default app;
