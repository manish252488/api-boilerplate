/**
 * User Routes
 */
import { Router } from 'express';
const UserController = require('../controllers/user.controller');
import passport from 'passport'
import validate from 'express-validation';

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

routes.post('/create',UserController.create)
routes.post('/login',UserController.login)

export default routes;
