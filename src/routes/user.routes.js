/**
 * User Routes
 */
import { Router } from "express";
const UserController = require("../controllers/user.controller");
import passport from "../config/AuthMiddlewares";
import { verifyApiKey } from "../config/AuthMiddlewares";
import multer from "multer";
import path from "path";
const routes = new Router();
/**
 * @api {get} /users/:id Details of a user
 * @apiDescription Gives detail of a user
 * @apiName User Details
 * @apiGroup User
 *
 * @apiSuccess {Number} status Status of the Request
 * @apiSuccess {String} message Message related to the completion
 * @apiSuccess {object} data the data of all the user fetched
 * @apiSuccess {String} id the id of the user
 * @apiSuccess {String} name the name of the user
 * @apiSuccess {String} email the email of the user
 * @apiSuccess {Number} roleId the role of the user
 * @apiSuccess {Number} status the status of the user (1-"active",0-"inactive")
 * @apiSuccess {String} source the source used to login by the user
 * @apiSuccess {String} lastLogin the dat and time of the last user Login
 * @apiSuccess {String} createdDate the date and time when the user account was created
 *
 * @apiSuccessExample Success-Response:
 *
 *   {
 *           "status": 200,
 *           "message": "user details fetched successfully",
 *           "data":
 *                   {
 *                       "id": "7pcx03fafd0ceas7ece424ee",
 *                       "name": "admin one",
 *                       "email": "abc123@gmail.com",
 *                       "roleId": "1",
 *                       "status": 1,
 *                       "source": "none",
 *                       "lastLogin": "2017-07-04T07:53:55.000Z",
 *                       "createdDate": "2017-07-04T07:53:55.000Z"
 *                  }
 *  }
 *
 * HTTP/1.1 200 OK
 *
 * @apiErrorExample {json} Post not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 *
 */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve("src/data/uploads"));
  },
  filename: function(req, file, cb) {
    const newFile = `${file.fieldname}-${Date.now()}-${file.originalname}`;
    cb(null, newFile);
  },
});
const upload = multer({ storage: storage });

routes.post("/create", [verifyApiKey], UserController.create);
routes.post(
  "/login",
  [verifyApiKey, passport.authenticate("login")],
  UserController.login
);
routes.get(
  "/list",
  [verifyApiKey, passport.authenticate("admin", { session: false })],
  UserController.listUsers
);
routes.put(
  "/update",
  [verifyApiKey, passport.authenticate("checkJwt", { session: false })],
  UserController.updateUser
);
routes.delete(
  "/delete",
  [verifyApiKey, passport.authenticate("checkJwt", { session: false })],
  UserController.deleteUser
);
routes.get(
  "/check",
  [verifyApiKey, passport.authenticate("checkJwt", { session: false })],
  UserController.checkJwt
);
routes.get(
  "/upload-profile-picture",
  [
    verifyApiKey,
    passport.authenticate("checkJwt", { session: false }),
    upload.single("file"),
  ],
  UserController.setProfilePicture
);
export default routes;
