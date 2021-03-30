
import { Router } from 'express';
import passport, { verifyApiKey } from '../config/AuthMiddlewares';
const ChatController = require('../controllers/chat.controller');

const routes = new Router();
routes.get('/send',[verifyApiKey,passport.authenticate('jwtCheck')], ChatController.chat);
export default routes;