/**
 * Configuration of the server middlewares.
 */

import morgan from "morgan";
import compression from "compression";
import passport from "../config/AuthMiddlewares";
import expressWinston from "express-winston";
import methodOverride from "method-override";
import helmet from "helmet";
import cors from "cors";
import expressStatusMonitor from "express-status-monitor";
import winstonInstance from "./winston";
import bodyParser from "body-parser";
import constants from "../config/constants";
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import chalk from 'chalk';
import { Response } from '../models/response.model';
import express from "express";
const isTest = process.env.NODE_ENV === "test";
const isDev = process.env.NODE_ENV === "development";

export default (app) => {
  app.use(compression());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json()).use(express.urlencoded({extended:true}))
  app.use(helmet());
  app.use(cors());
  app.use(expressStatusMonitor());
  app.use(methodOverride());
  app.use(require("serve-static")(__dirname + "/../../public"));
  app.use(cookieParser());
  app.use(
    expressSession({
      secret: constants.JWT_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  if (isDev && !isTest) {
    app.use(morgan("dev"));
    expressWinston.requestWhitelist.push("body");
    expressWinston.responseWhitelist.push("body");
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true,
        msg:
          "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        colorStatus: true,
      })
    );
  }



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
};
