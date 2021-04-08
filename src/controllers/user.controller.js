/**
 * User controller
 */
import Joi from "joi";
import User from "../models/user.model";

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
      roleId: Joi.number(),
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
      return res.success("user created", userObject.toAuthJSON());
    } else {
      if (user[0].status === 0)
        return res.error(
          "email already exists.login to activate your account!"
        );
      else return res.error("user already exists!");
    }
  } catch (e) {
    return res.error("Error occurred while creating user", e);
  }
}

export async function login(req, res) {
  try {
    return res.success("user logged in!", req.user.toAuthJSON());
  } catch (e) {
    return res.error("error while authenticating", e);
  }
}

export async function listUsers(req, res) {
  try {
    let data = await User.find();
    return res.success("users list", data);
  } catch (err) {
    return res.error("error listing users", err);
  }
}

export async function updateUser(req, res) {
  try {
    const user = req.user;
    await User.updateOne({ _id: user.id }, { ...req.body });
    const updated = await User.findById(user.id);
    return res.success("user Updated!", updated);
  } catch (err) {
    return res.error("error updating user", err);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = req.user;
    await User.findByIdAndUpdate(user.id, { status: 0 });
    return res.success("user deactivated");
  } catch (err) {
    return res.error("cannot deactivate user", err);
  }
}
export async function checkJwt(req,res){
    try {
    const user = req.user;
    return res.success("user authorized", user);
  } catch (err) {
    return res.error("cannot authorize user", err);
  }
}