import express from "express";
import { auth, isLoggedIn } from "../middleware/authrzition.js";
import {
  deleteCart,
  getCart,
  postCartProd,
  updateCart,
} from "../controllers/cartController.js";
const router = express.Router();

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------


router.get("/users/:userId/cart", isLoggedIn, auth, getCart);


router.post("/users/:userId/cart", isLoggedIn, auth, postCartProd);
router.put("/users/:userId/cart", isLoggedIn, auth, updateCart);
router.delete("/users/:userId/cart", isLoggedIn, auth, deleteCart);


export default router;
