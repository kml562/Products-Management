import productModel from "../models/ProductModel.js";
import { isValid } from "../utils/validatior/validatior.js";

export const postProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      productImage,
    } = req.body;

    const createProduct = await productModel.create(req.body);
    if (!createProduct) {
      res.status(400).json({ status: false, message: "some error" });
    }
    res.status(201).json({ status: true, message: createProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    // Find Data-----------------------------------------------------------------------
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

// PUT /products/:productId
// Updates a product by changing at least one or all fields
// Check if the productId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
// Response format
// On success - Return HTTP status 200. Also return the updated product document. The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

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
