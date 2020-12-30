/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs'
import { hashSync, genSaltSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import constants from '../config/constants';
import * as validator from 'validator';
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
    },
    source: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [false, 'Email is required!'],
      trim: true,
      validate: {
        validator(emailId) {
          return typeof emailId == 'string' && validator.isEmail(emailId)
        },
        message: 'invalid mail Account ID'
      }
    },
    roleId: {
      type: String,
      enum:['0','1'],
      default:'1',
      required: true,

    },
    picture: {
      type: String
    },
    status: {
      type: Number,
      max: 1,
      min: 0
    },
    createdDate: {
      type: Date
    },
    updatedDate: {
      type: Date
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, 'Password need to be longer!'],
      validate: {
        validator(password) {
          return password.length >= 6 && password.match(/\d+/g);
        },
      },
    },
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true },
);

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

// Hash the user password on creation
UserSchema.pre('save', function (next) {
  console.log(this.isModified('password'));
  if (this.password && this.isModified('password')) {
    var salt = genSaltSync(12);
     this.password = hashSync(this.password , salt);
   // this.password = (this.password);
  }

  next()
});
// UserSchema.methods.adminAuth = async function (inputPass , correctPass){
//   return await bcrypt.compare(inputPass, correctPass);
// }

  UserSchema.methods = {

 async adminAuth(inputPass , correctPass){
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
      const token = jwt.sign({ "email": this.email, "role": this.roleId, "id": this._id }, constants.JWT_SECRET)
      console.log("token:", token)
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
         roleId: this.roleId===0?"admin":"user",
        accessToken: `JWT ${this.createToken()}`,
        name: this.name,
        email: this.email
      };
    },

    /**
     * Parse the user object in data we wanted to send
     *
     * @public
     * @returns {Object} User - ready for populate
     */
    toJSON() {
      return {
        id: this._id,
        name: this.name,
        email: this.email,
        roleId: this.roleId === 0 ? "admin" : "user",
        status: this.status,
        source: this.source || "none"
      };
    },
  };
  const User = mongoose.model('User', UserSchema);
  module.exports = User
//  let User;

//  try {
//    User = mongoose.model('User');
//  } catch (e) {
   
//  }



