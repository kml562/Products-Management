import express from "express";
import {
  DeleteProduct,
  UpdateProduct,
  createProduct,
  getProduct,
  getProductId,
} from "../controllers/productCntroller.js";
const router = express.Router();

router.get("/products", getProduct);
router.post("/products", createProduct);
router.get("/products/:productId", getProductId);
router.put("/products/:productId", UpdateProduct);
router.delete("/products/:productId", DeleteProduct);

export default router;
