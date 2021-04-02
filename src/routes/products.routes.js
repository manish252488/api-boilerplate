import { Router } from 'express';
const UserController = require('../controllers/user.controller');
import passport from '../config/AuthMiddlewares';
import { verifyApiKey } from '../config/AuthMiddlewares';
import * as ProductController from '../controllers/products.controller';
import multer from 'multer';
const routes = new Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/data/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({ storage: storage })

routes.post("/image",[verifyApiKey,passport.authenticate('admin'),upload.single('file')],ProductController.addProduct)

export default routes;