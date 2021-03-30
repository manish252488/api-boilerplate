/**
 * User controller
 */
import { ExtendableError } from '../services/error'
import bcrypt from 'bcryptjs'
import Joi, { date, validate } from "joi";
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
      picture: Joi.string(),
      roleId: Joi.number()
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
    let userObject = null;
    if (!user || user.length <= 0) {
      userObject = await User.create(userProfile);
      data.id = user.id;
      return res.success("user created", userObject.toAuthJSON())
    } else {
     return res.error("user already exists!")
    }
  } catch (e) {
    return res.error("Error occurred while creating user", e);
  }
}

export async function login(req, res) {
  try {
     return res.success("user logged in!", req.user.toAuthJSON())
  } catch (e) {
    return res.error("error while authenticating", e);
  }
}


export async function listUsers(req,res){
  try{
    let data = await User.find({});
    return res.success("users list", data)
  }catch(err){
    return res.error("error listing users", err)
  }
}



