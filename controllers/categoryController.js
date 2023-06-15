import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).json({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New Category Created Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).sedn({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

// UPDATE CATEGORY
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully...!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Whle Updating...!",
      error,
    });
  }
};

// GET ALL CATEGORY
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting All Categories..!",
      error,
    });
  }
};

// GET SINGLE PRODUCT
export const singleController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "Got Single Category",
      category,
    });
  } catch (error) {
    console.log(error);

    res.send({
      success: false,
      message: "Error While Getting single Category..!",
      error,
    });
  }
};

// DELETE CATEGORY
export const deleteController = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Category deleted successfully...!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error While Deleting Category...!",
      error,
    });
  }
};
