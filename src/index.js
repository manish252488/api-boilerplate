/* eslint-disable no-console */
/**
 * Server setup
 */
import express from 'express';
import chalk from 'chalk';
import './config/database';
import middlewaresConfig from './config/middlewares';
import ApiRoutes from './routes';
import http from 'http';
import https from 'https';
import fs from 'fs';

// import {ipMiddleware} from './config/middlewares'
const app = express();
middlewaresConfig(app);
app.use("/", ApiRoutes);

let server;
if (process.env.APP_ENV === 'production') {
  const options = {
    key: fs.readFileSync('/<location>/privkey.pem', 'utf-8'),
    cert: fs.readFileSync('cert_location', 'utf-8')
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
export default app;
