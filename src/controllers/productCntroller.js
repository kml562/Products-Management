import { uploadData } from "../aws/aws.js";
import productModel from "../models/ProductModel.js";
import { isValid } from "../utils/validatior/validatior.js";

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      productImage,
      availableSizes,
    } = req.body;

    if (!title || !description || !price || !currencyId || !currencyFormat)
      return res.status(400).json({
        status: false,
        message: "Please enter all the required fields",
      });

    const validSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];

    if (
      !Array.isArray(availableSizes) ||
      availableSizes.length === 0 ||
      !availableSizes.every((size) => validSizes.includes(size))
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Please provide at least one valid size from the available options",
      });
    }

    const files = req.files;

    if (files && files.length > 0) {
      let uploadedFileURL = await uploadData(files[0]);
      req.body.productImage = uploadedFileURL;
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect Image" });
    }

    if (availableSizes.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one size must be specified",
      });
    }

    // if(typeof(price) !== 'number'){
    //     return res.status(400).json({status : false, message : "Please enter correct number"})
    // }

    const product = await productModel.create(req.body);

    res.status(201).json({
      status: true,
      message: "Success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

export const getProduct = async (req, res) => {
  try {
    const serchdata = req.body;
    serchdata.isDeleted = false;
    const getdata = await productModel.find();
    if (getdata.length === 0) {
      return res.status(400).json({ status: false, data: "No data found" });
    }
    res.status(200).json({ status: true, data: serchdata });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// getProductID------------------------------------------------------------------------------------------

export const getProductId = async (req, res) => {
  try {
    const { userId } = req.params;
    // userID and token ID check---------------------------------------------------------------------------
    const tokenUserId = req.decodedToken.id;
    if (userId !== tokenUserId) {
      return res.status(400).json({
        status: false,
        message: "userId and tokenId must be the same",
      });
    }

    // Find Data----------------------------------------------------------------------------------
    const getuserData = await productModel.findById(userId);
    if (!getuserData) {
      return res.status(400).json({
        status: false,
        message: "userId and tokenId must be the same",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Success",
      data: getuserData,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

// getProductID------------------------------------------------------------------------------------------

export const UpdateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValid(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Product ID" });
    }
    const checkProduct = await productModel
      .findById(productId)
      .where("isDeleted")
      .equals(false);
    if (!checkProduct) {
      return res
        .status(400)
        .json({ status: false, message: "product not found" });
    }
    let data = req.body;
    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      data,
      { new: true }
    );

    return res
      .status(200)
      .json({ status: false, message: "success", data: updateProduct });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Delete product----------------------------------------------------------------------------
export const DeleteProduct = async () => {
  try {
    const { productId } = req.params;
    if (!isValid(productId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Product ID" });
    }
    const checkProduct = await productModel
      .findById(productId)
      .where("isDeleted")
      .equals(false);
    if (!checkProduct) {
      return res
        .status(400)
        .json({ status: false, message: "product not found" });
    }
    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );

    return res
      .status(200)
      .json({ status: false, message: "success", data: updateProduct });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
