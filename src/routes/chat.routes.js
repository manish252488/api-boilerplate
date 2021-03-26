
import { Router } from 'express';
const ChatController = require('../controllers/chat.controller');

const routes = new Router();
routes.get('/send', ChatController.chat);
export default routes;