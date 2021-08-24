import { Router } from "express";
import passport from "../config/AuthMiddlewares";
import { verifyApiKey } from "../config/AuthMiddlewares";
import * as ProductController from "../controllers/products.controller";
import multer from "multer";
import path from "path";
const routes = new Router();

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

routes.post(
  "/add",
  [verifyApiKey, passport.authenticate("admin"), upload.single("file")],
  ProductController.addProduct
);
routes.get(
  "/list",
  [verifyApiKey, passport.authenticate("checkJwt")],
  ProductController.listProducts
);
routes.put(
  "/update/:id",
  [verifyApiKey, passport.authenticate("checkJwt"), upload.single("file")],
  ProductController.updateProduct
);
routes.delete(
  "/delete/:id",
  [verifyApiKey, passport.authenticate("checkJwt")],
  ProductController.deleteProduct
);
routes.post(
  "/update-picture",
  [verifyApiKey, passport.authenticate("admin"), upload.single("file")],
  ProductController.updatePicture
);
routes.post("/ratings/:id/:stars");
export default routes;
