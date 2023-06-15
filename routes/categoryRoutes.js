import express from "express";
import {
  categoryController,
  createCategoryController,
  deleteController,
  singleController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// CREATING CATEGORY
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// UPDATE CATEGORY
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// GET ALL CATEGORY
router.get("/get-category", categoryController);

// GET SINGLE CATEGORY
router.get("/single-category/:slug", requireSignIn, isAdmin, singleController);

// DELETE  CATEGORY
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteController);

export default router;
