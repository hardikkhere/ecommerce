import express from "express";
import {
  braintreePaymentController,
  brainTreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// CREATING PRODUCTS
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// UPDATE PRODUCTS
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// GETTING ALL PRODUCTS
router.get("/get-product", getProductController);

// GETTING SINGLE PRODUCT
router.get("/get-product/:slug", getSingleProductController);

// GET PHOTO
router.get("/product-photo/:pid", productPhotoController);

// DELETE PRODUCT
router.delete("/delete-product/:pid", deleteProductController);

// FILTER PRODUCT
router.post("/product-filters", productFiltersController);

//  PRODUCT COUNT
router.get("/product-count", productCountController);

//  PRODUCT PER PAGE
router.get("/product-list/:page", productListController);

// SEARCH  PRODUCT
router.get("/search/:keyword", searchProductController);

// GET SIMILIAR  PRODUCT
router.get("/related-product/:pid/:cid", relatedProductController);

// GET CATEGORY WISE  PRODUCT
router.get("/product-category/:slug", productCategoryController);

//  ----------------------- PAYMENT ROUTES ---------------------

// BRAINTREE TOKEN CONTROLLER
router.get("/braintree/token", brainTreeTokenController);

// BRAINTREE PAYMENTS CONTROLLER
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
