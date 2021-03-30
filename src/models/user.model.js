/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { hashSync, genSaltSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import constants from "../config/constants";
import * as validator from "validator";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [false, "Email is required!"],
      trim: true,
      validate: {
        validator(emailId) {
          return typeof emailId == "string" && validator.isEmail(emailId);
        },
        message: "invalid mail Account ID",
      },
    },
    roleId: {
      type: Number,
      // 0 - guest
      // 1 - user
      // 2 - admin
      enum: [0, 1, 2],
      default: 1,
      required: true,
    },
    picture: {
      type: String,
    },
    status: {
      type: Number,
      max: 1,
      min: 0,
      default: 1,
    },
    createdDate: {
      type: Date,
      default: new Date(),
    },
    updatedDate: {
      type: Date,
      default: new Date(),
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, "Password need to be longer!"],
      validate: {
        validator(password) {
          return password.length >= 6 && password.match(/\d+/g);
        },
      },
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});
// Hash the user password on creation
UserSchema.pre("save", async function(next) {
  if (this.password && this.isModified("password")) {
    var salt = genSaltSync(12);
    this.password = hashSync(this.password, salt);
  }

  next();
});
UserSchema.pre("updateOne", async function(next) {
  if (this._update.password) {
    var salt = genSaltSync(12);
    this._update.password = hashSync(this._update.password, salt);
  }
  next();
});

UserSchema.methods = {
  async adminAuth(inputPass, correctPass) {
    return await bcrypt.compare(inputPass, correctPass);
  },

  /**
   * Authenticate the user
   *
   * @public
   * @param {String} password - provided by the user
   * @returns {Boolean} isMatch - password match
   */
  authenticateUser(password) {
    return !this.password ? false : compareSync(password, this.password);
  },
  /**
   * Generate a jwt token for authentication
   *
   * @public
   * @returns {String} token - JWT token
   */
  createToken() {
    const token = jwt.sign(
      { email: this.email, role: this.roleId, id: this._id },
      constants.JWT_SECRET
    );
    return token;
  },
  /**
   * Parse the user object in data we wanted to send when is auth
   *
   * @public
   * @returns {Object} User - ready for auth
   */
  toAuthJSON() {
    return {
      user: {
        id: this._id,
        roleId: this.roleId === 0 ? "admin" : "user",
        name: this.name,
        email: this.email,
        picture: this.picture,
        roleId:
          this.roleId === 0 ? "guest" : this.roleId === 1 ? "user" : "admin",
        status: this.status,
        source: this.source || "none",
      },
      token: `JWT ${this.createToken()}`,
    };
  },
  /**
   * Parse the user object in data we wanted to send
   *
   * @public
   * @returns {Object} User - ready for populate
   */
  toObject() {
    return {
      user: {
        id: this._id,
        roleId: this.roleId === 0 ? "admin" : "user",
        name: this.name,
        email: this.email,
        picture: this.picture,
        roleId:
          this.roleId === 0 ? "guest" : this.roleId === 1 ? "user" : "admin",
        status: this.status,
        source: this.source || "none",
        password: this.password,

      },
    };
  },
  toJSON() {
    return {
      id: this._id,
      roleId: this.roleId === 0 ? "admin" : "user",
      name: this.name,
      email: this.email,
      picture: this.picture,
      roleId:
        this.roleId === 0 ? "guest" : this.roleId === 1 ? "user" : "admin",
      status: this.status,
      source: this.source || "none",
      createdDate: this.createdDate,
      updatedDate: this.updatedDate,
      lastLogin: this.lastLogin
      
    };
  },
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
