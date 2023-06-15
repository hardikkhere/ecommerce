import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // VALIDATION
    if (!name) {
      return res.json({ message: "Name is required" });
    }

    if (!email) {
      return res.json({ message: "Email is required" });
    }

    if (!password) {
      return res.json({ message: "password is required" });
    }

    if (!phone) {
      return res.json({ message: "Phone is required" });
    }

    if (!address) {
      return res.json({ message: "Address is required" });
    }

    console.log("After existingUser");
    if (!answer) {
      return res.json({ message: "Answer is required" });
    }

    // CHECKING  USER
    const existingUser = await userModel.findOne({ email });

    // CHECKING EXISTING USER
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User with this email already exist ",
      });
    }
    // Register user
    const hashedPassword = await hashPassword(password);
    // save user

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(201).json({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in registraion",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // CHECKING USER WITH EMAIL
    const user = await userModel.findOne({ email });
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
      });
    }

    // CHECKING PASSWORD
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully..!",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some internal server error occured",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.status(200).send({
    success: true,
    message: "In Protected route",
  });
  console.log("Protedcted route");
};

// forgotPassword CONTROLLER
export const forgotController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
    }
    if (!answer) {
      console.log("in answer validation");
      res.status(400).json({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).json({ message: "New Password is required" });
    }

    // CHECKING EMAIL AND PASSWORD
    const user = await userModel.findOne({ email, answer });
    // VALIDATION
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Wrong Email or Password",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// UPDATE PROFILE

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // CHECK PASSWORD

    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// ORDERS

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting orders",
      error,
    });
  }
};

// GET ALL ORDER
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting all orders",
      error,
    });
  }
};

// ORDER STATUS
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating order...! ",
      error,
    });
  }
};
