/**
 * Configuration of the server middlewares.
 */

import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import passport from 'passport';
import expressWinston from 'express-winston';
import methodOverride from 'method-override';
import helmet from 'helmet';
import cors from 'cors';
import expressStatusMonitor from 'express-status-monitor';
import winstonInstance from './winston';
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
import jwt from 'jsonwebtoken';
import util from 'util';
import requestip from 'request-ip';
import constants from '../config/constants';
// import geoIp from 'geoip-lite';
import chalk from 'chalk';

export default app => {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(helmet());
  app.use(cors());
  app.use(expressStatusMonitor());
  app.use(methodOverride());
  if(isDev && !isTest) {
    app.use(morgan('dev'));
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true,
        msg:
          'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true,
      }),
    );
  }
};

export function ipMiddleware(req, res, next) {
  const client = requestip.getClientIp(req);
  console.log("IP ADDRESS::", client);
  next();
}

export function checkAuth(req, res, next) {
  try {
    const bearerHeader = req.get('Authorization');
    //console.log("beare header", bearerHeader)
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmVrLnNoYXJtYUBoYXNoYmluYXJ5LmNvbSIsInJvbGUiOjEsImlkIjoiNWYwZDE1YWE5NDMxNzE0MzFjZWFkYWFhIiwiaWF0IjoxNTk0NjkzMDM1fQ.zaaV7x-vHnRqk3I9OfC7TGCWrcf8DGhgxsTAuctMwb"
    //console.log(token)
    if(token) {
      const decode = jwt.verify(token, constants.JWT_SECRET);
      //console.log(decode)
      // console.log(chalk.green(decode))
      // console.log(util.inspect(decode, { showHidden: false, depth: null }))
      // console.log(req.body)
      req.locals = {}
      req.locals.id = decode.id
      req.locals.email = decode.email;
      req.locals.roleId = decode.role;
      console.log("USER AUTHORIZED")
      next();
    } else {
      console.log("token not found")
      return res.error("Token Not Found", {}, "Token Not Found", 401);
    }
  } catch(e) {
    console.log(e)
    return res.error("Authorization Failed", {}, "Authorization Failed", 401);

  }
}
