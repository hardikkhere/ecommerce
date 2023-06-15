import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import braintree from "braintree";

dotenv.config();

// PAYMENT GATEWAY

var gateaway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// CREATING A NEW PRODUCT
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // VALIDATION
    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is Required" });

      case !description:
        return res.status(500).json({ error: "Description is Required" });

      case !price:
        return res.status(500).json({ error: "Price is Required" });

      case !category:
        return res.status(500).json({ error: "Category is Required" });

      case !quantity:
        return res.status(500).json({ error: "Qantity is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully...!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product..!",
      error,
    });
  }
};

// GETTING ALL PRODUCTS
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// GETTING SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).json({
      success: true,
      message: "Single Product Fetched Successfully..!",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Getting Single Product",
      error,
    });
  }
};

// GETTING PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "",
    });
  }
};

// DELETING A PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).json({
      success: true,
      message: "Product deleted successfully..!",
    });
  } catch (error) {
    console.log(error);
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // VALIDATION
    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is Required" });

      case !description:
        return res.status(500).json({ error: "Description is Required" });

      case !price:
        return res.status(500).json({ error: "Price is Required" });

      case !category:
        return res.status(500).json({ error: "Category is Required" });

      case !quantity:
        return res.status(500).json({ error: "Qantity is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "Photo is Required and should be less than 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).json({
      success: true,
      message: "Product updated successfully...!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating product..!",
      error,
    });
  }
};

// FILTER PRODUCT
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: false,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error while filtering Products",
      error,
    });
  }
};

// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

// PRODUCT LIST BASE ON PAGE

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// SEARCH PRODUCT
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product API",
      error,
    });
  }
};
// SIMILIAR PRODUCT
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: false,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: fasle,
      message: "Error while  getting related product",
      error,
    });
  }
};

// GET PRODUCT BY CATEGORY
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while geting product category",
      error,
    });
  }
};

//--------------------  PAYMENT GATEWAY API'S ------------------------

// BRAINTREE TOKEN
export const brainTreeTokenController = async (req, res) => {
  try {
    gateaway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// BRAINTREE PAYMENT
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    let newTransaction = gateaway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
