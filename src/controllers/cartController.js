// POST /users/:userId/cart (Add to cart)
// Create a cart for the user if it does not exist. Else add product(s) in cart.
// Get cart id in request body.
// Get productId in request body.
// Make sure that cart exist.
// Add a product(s) for a user in the cart.
// Make sure the userId in params and in JWT token match.
// Make sure the user exist
// Make sure the product(s) are valid and not deleted.
// Get product(s) details in response body.
// Response format
// On success - Return HTTP status 201. Also return the cart document. The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this

import cartModel from "../models/CartModel";
import { isValid } from "../utils/validatior/validatior";

export const postProductCart = async(req, res) => {
  try {
    const { userId, items, quantity, totalPrice, totalItems } = req.body;
    if (!userId || !items || !quantity || !totalPrice || !totalItems)
      return res
        .status(400)
        .json({ status: "false", message: "filled all the required fields" });

    if (!isValid(userId))
      return res
        .status(400)
              .json({ status: "false", message: "user Id is not valid" });
      
      const postdata = await cartModel.create(req.body);
      if (!postdata) {
        return   res.status(400).json({ status: "false", message: "error in post data" });
      };
      return res.status(201).json({status:false, message:postdata});
      
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
