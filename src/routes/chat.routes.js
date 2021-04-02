
import { Router } from 'express';
import passport, { verifyApiKey } from '../config/AuthMiddlewares';
const ChatController = require('../controllers/chat2.controller');

const routes = new Router();
routes.get('/send',[verifyApiKey,passport.authenticate('checkJwt')], ChatController.chat);
export default routes;