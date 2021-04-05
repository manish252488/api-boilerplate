import {
  productUpdateValidation,
  productValidation,
} from "../config/validations";
import Product from "../models/product.model";

export async function addProduct(req, res) {
  try {
    let product = req.body;
    await productValidation(product);
    product.picture = req.file.filename;
    product.user = req.user.id;
    let data = await Product.create(product);
    return res.success("product added !", data);
  } catch (err) {
    return res.error("unable to add product!", err);
  }
}
export async function listProducts(req, res) {
  try {
    let data;
    if (req.query.userId) {
      data = await Product.find({ user: req.query.userId });
    } else {
      data = await Product.find();
    }
    return res.success("products!", data);
  } catch (err) {
    return res.error("unable to list products!", err);
  }
}

export async function updateProduct(req, res) {
  try {
    await productUpdateValidation(req.body);
    if (req.params.id) {
      let product = await Product.findById(req.params.id);
      if (product) {
        if (product.user === req.user.id) {
          let data = await Product.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
          );
          return res.success("product updated!", data);
        } else {
          return res.error(
            "only the product owner can edit the product details!"
          );
        }
      }
    } else {
      return res.error("provide an product id to update!");
    }
  } catch (err) {
    return res.error("unable to update product", err);
  }
}
export async function deleteProduct(req, res) {
  try {
    if (req.params.id) {
      let product = await Product.findById(req.params.id);
      if (product) {
        if (product.user === req.user.id) {
          let data = await Product.findOneAndUpdate(
            { _id: req.params.id },
            { status: 0 },
            { new: true }
          );
          return res.success("product deleted!", data);
        } else {
          return res.error("only the product owner can delete the product !");
        }
      } else {
        return res.error("no product found!");
      }
    } else {
      return res.error("provide an product id to delete!");
    }
  } catch (err) {
    return res.error("unable to delete product", err);
  }
}
export async function updatePicture(req, res) {
  try {
    if (req.params.id) {
      let product = await Product.findById(req.params.id);
      if (product) {
        if (product.user === req.user.id) {
          let data = await Product.findOneAndUpdate(
            { _id: req.params.id },
            { picture: req.file.filename },
            { new: true }
          );
          return res.success("picture updated", data);
        } else return res.error("only owner can update the picture!");
      } else {
        return res.error("no product found");
      }
    }
    return res.error("enter a product id to be updated!");
  } catch (err) {
    return res.error("cannot update picture!", err);
  }
}

export async function ratings(req, res) {
  try {
    if (req.params.id) {
      let product = await Product.findById(req.params.id);
      if(product.user === req.user.id){
          return res.error("owner cannot add ratings!");
      }
      if (product) {
            let stars=product.stars;
            let totalRatings = product.totalRatings;
            stars = (stars + req.params.stars)/(totalRatings + 1);
            await Product.findOneAndUpdate({_id: req.params.id, stars: stars, totalRatings: totalRatings + 1})
            return res.success("stars addded!");
      } else return res.error("product not found!");
    } else return res.error("product id missing!");
  } catch (err) {
    return res.error("unable add ratings", err);
  }
}
