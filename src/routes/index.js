/**
 * API Routes
 */

import { Router } from "express";
import HTTPStatus from "http-status";
import UserRoutes from "./user.routes";
import ChatRoutes from "./chat.routes";
import ProductRoutes from "./products.routes";
import APIError from "../services/error";
import FilesRoutes from "./files.routes";
// Middlewares

const routes = new Router();

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
routes.use("/users", UserRoutes);
routes.use("/chat", ChatRoutes);
routes.use("/product", ProductRoutes);
routes.use("/files", FilesRoutes);
routes.all("*", (req, res, next) =>
  next(new APIError("Not Found!", HTTPStatus.NOT_FOUND, true))
);

export default routes;
