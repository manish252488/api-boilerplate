/**
 * User Routes
 */
import { Router } from 'express';
const UserController = require('../controllers/user.controller');
import passport from 'passport'
import validate from 'express-validation';

const routes = new Router();


/**
 * @api {post} /users/register Register user
 * @apiDescription Register a new user
 * @apiName Registers a user
 * @apiGroup User
 *
 * @apiParam (Body) {String} source the name of sso which user is using to login
 * @apiParam (Body) {String} accessToken access token obtained from the sso service
 * @apiParam (Body) {String} refreshToken refresh token obtained from the sso service
 *
 * @apiParamExample {json} Request-Example:
 *
 *          {
 *              "source":"google",
 *              "access_token:"ekn12o11-2idnwqjndw.ldqwwqwkdqo.qwkdnqwi"
 *              "refresh_token":"wekjfnwkjefbwd[ql-12ij12e2e9-231293"
 *          }
 *
 *
 * @apiSuccess {Number} status Status of the Request
 * @apiSuccess {String} message Message related to the completion
 * @apiSuccess {String} uploadLocation Location name where the file was uploaded
 * @apiSuccess {String} downloadUrl Url to the uploaded file or download url
 *
 * @apiSuccessExample Success-Response:
 *
 *   {
 *          "status": 200,
 *          "message": "User created/ User Logged in"
 *   }
 *
 * HTTP/1.1 200 OK
 * 
 * @apiErrorExample {json} Post not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */

routes.post('/register', validate(UserController.validation.create), UserController.create);

/**
 * @api {get} /users/ List of users
 * @apiQueryParams {page} Page number
 * @apiQueryParams {limit} Number of documents to be shown
 * @example {get} /users/list?page=1&limit=5
 * @apiDescription Gives a list of all the users
 * @apiName Users List
 * @apiGroup User
 *
 * @apiSuccess {Number} status Status of the Request
 * @apiSuccess {String} message Message related to the completion
 * @apiSuccess {array} data the data of all the users as elements of array
 * @apiSuccess {String} id the id of the user
 * @apiSuccess {String} name the name of the user
 * @apiSuccess {String} email the email of the user
 * @apiSuccess {String} roleId the role of the user
 * @apiSuccess {Number} status the status of the user (1-"active",0-"inactive")
 * @apiSuccess {String} source the source used to login by the user
 * @apiSuccess {String} lastLogin the dat and time of the last user Login
 * @apiSuccess {String} createdDate the date and time when the user account was created
 *
 * @apiSuccessExample Success-Response:
 *
 *   {
 *           "status": 200,
 *           "message": "users fetched successfully",
 *           "data": [
 *                   {
 *                       "id": "7pcc03fvd0ceef07ece424ee",
 *                       "name": "user one",
 *                       "email": "abc123@gmail.com",
 *                       "roleId": "user",
 *                       "status": 1,
 *                       "source": "none",
 *                       "lastLogin": "2017-07-04T07:53:55.000Z",
 *                       "createdDate": "2017-07-04T07:53:55.000Z"
 *                  },
 *                  {
 *                       "id": "7pcc03fvd0ceef07ece424ee",
 *                       "name": "user two",
 *                       "email": "xyz789@gmail.com",
 *                       "roleId": "user",
 *                       "status": 1,
 *                       "source": "none",
 *                       "lastLogin": "2017-07-04T07:53:55.000Z",
 *                       "createdDate": "2017-07-04T07:53:55.000Z"
 *                  }
 *              ]
 *   }
 *
 * HTTP/1.1 200 OK
 * 
 * @apiErrorExample {json} Post not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */

routes.get('/list', passport.authenticate('jwt', { session: false }), UserController.listUsers);

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
routes.post('/login', UserController.AdminLogin);
routes.post('/signup', UserController.AdminSignUp)

routes.get('/detail/:id', UserController.getUserDetail);


/*routes.post(
    '/login',
    validate(UserController.validation.login),
    authAdmin,
    UserController.login
  );  */



export default routes;
