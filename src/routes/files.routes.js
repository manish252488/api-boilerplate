import { Router } from "express";
const UserController = require("../controllers/user.controller");
import passport from "../config/AuthMiddlewares";
import { verifyApiKey } from "../config/AuthMiddlewares";
import * as Controller from "../controllers/files.controller";
const routes = new Router();

routes.get(
  "/get",
  [verifyApiKey, passport.authenticate("checkJwt")],
  Controller.getFiles
);

export default routes;
