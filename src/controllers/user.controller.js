/**
 * User controller
 */
import { ExtendableError } from '../services/error'
import bcrypt from 'bcryptjs'
import Joi, { date } from "joi";
import User from "../models/user.model";
import rbac from "../config/rbac";
import jwt from "jsonwebtoken";
import constants from "../config/constants";
import chalk from "chalk";

export const validation = {
  login: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    },
  },
  create: {
    body: {
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
      source: Joi.string(),
      status: Joi.number()
        .min(0)
        .max(1),
      createdDate: Joi.date(),
      updatedDate: Joi.date(),
      lastLogin: Joi.date(),
    },
  },
};

export async function create(req, res) {
  let userProfile = req.body;
  let data = {
    userName: userProfile.name,
    email: userProfile.email,
  };
  try {
    let user = await User.find({
      email: userProfile.email,
      source: userProfile.source,
    });
    console.log(user);
    let userObject = null;
    if (!user || user.length <= 0) {
      console.log("createing new user");
      userObject = await User.create(userProfile);
      data.id = user.id;
      console.log("user created");
    } else {
      console.log("user logged in");
      userObject = await User.findById(user[0].id);
    }
    return res.success("user authenticated", userObject.toAuthJSON());
  } catch (e) {
    console.error("Error occurred while creating user", e);
    return res.error("Error occurred while creating user", e);
  }
}

export async function login(req, res, next) {
  try {
    if (req.user.error) {
      return res.error("User authorization failed", req.user.error);
    } else {
      return res.success("LOGIN SUCCESS", req.user.toAuthJSON());
    }
  } catch (e) {
    console.error("error which authenticating admin", e);
    return res.error("error which authenticating admin", e);
  }
}

export async function getUserDetail(req, res, next) {


  try {
    let users = await User.findById(req.params.id);
    res.status(200).json(users)
  } catch (e) {

    res.status(500).json({ error: e.message })
  }
}

export async function listUsers(req, res, next) {
  try {
    let query, users
    if (req.query.page && req.query.limit) {
      const page = Number(req.query.page)
      const limit = Number(req.query.limit);
      const skip = (page - 1) * limit;
      query = User.find()
      query = query.skip(skip).limit(limit)
      users = await query
    } else {
      query = User.find()
      users = await query
    }

    res.status(200).json({ users });
  } catch (e) {
    res.status(400).json({ err: e.message })


  }
}




exports.AdminLogin = async (req, res) => {

  if (req.body.email && req.body.password) {
    let { email, password } = req.body;

    const user = await User.findOne({ email });


    if (user.roleId == '0') {
      if (!user || !(await user.adminAuth(password, user.password))) {
        res
          .status(401)
          .json({ err: "Password Did not match or some other error" });

      } else {
        var payload = { userid: user._id };
        let sectoken = constants.JWT_SECRET
        var token = jwt.sign(payload, sectoken);
        user.roleId === '0' ? user['roleId'] = "admin" : user['roleId'] = "user"
        res.status(200).json({ message: "ok", user, token: token });
      }
    } else {
      res.status(400).json({ error: "Send email and pass" })
    }
  } else {
    res.status(401).json({ error: "Unauthorized Login" })
  }


}



exports.AdminSignUp = async (req, res) => {
  try {
    let signupData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,

    };

    var data = await User.create(signupData);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    console.log(err.message);
  }
}
