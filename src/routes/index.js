/**
 * API Routes
 */

import { Router } from 'express';
import HTTPStatus from 'http-status';
import UserRoutes from './user.routes';
import APIError from '../services/error';
// Middlewares

const routes = new Router();

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
routes.use('/users', UserRoutes);
routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);


export default routes;
