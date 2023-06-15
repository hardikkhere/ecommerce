import express from "express";
import {
  forgotController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";

// router object
const router = express.Router();

//  routing
// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// FOROGT PASSWORD || METHOD POST
router.post("/forgot-password", forgotController);

//TEST ROUTE
router.get("/test", requireSignIn, isAdmin, testController);

// PROTECTED USER ROUTE AUTH
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECTED ADMIN ROUTE AUTH
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//  UPDATE PROFILE
router.put("/profile", requireSignIn, updateProfileController);

// GETING ORDERS
router.get("/orders", requireSignIn, getOrdersController);

// GETING ALL ORDERS
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
