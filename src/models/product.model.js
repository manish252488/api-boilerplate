/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"],
      trim: true,
    },
    user: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stars: {
      type: Number,
      min: 0,
      max: 5,
    },
    MPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    SPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
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
  },
  { timestamps: true }
);

ProductSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

ProductSchema.methods = {
  toJSON() {
    if (this.status === 1) {
      return {
        id: this._id,
        name: this.name,
        user: this.user,
        category: this.category,
        description: this.description,
        stars: this.stars,
        MPrice: this.MPrice,
        SPrice: this.SPrice,
        discount: this.discount,
        picture: this.picture,
        status: this.status,
        createdDate: this.createdDate,
        updatedDate: this.updatedDate,
      };
    }
  },
};
const Product = mongoose.model("Products", ProductSchema);
module.exports = Product;
