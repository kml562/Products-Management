import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return !isNaN(value) && isFinite(value);
        },
        message: "Invalid price value", }, },
    currencyId: {
      type: String,
      required: true,
      enum: ["INR"],
    },
    currencyFormat: {
      type: String,
      required: true,
      default: "₹",
    },
    isFreeShipping: {
      type: Boolean,
      default: false,
    },
    productImage: {
      type: String,
      required: true,
    },
    style: {
      type: String,
    },
    availableSizes: {
      type: [String],
      validate: {
        validator: function(sizes) {
          return sizes.length >= 1;
        },
        message: "At least one size must be provided",
      },
      enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
    },
    installments: {
      type: Number,
    },
    deletedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);




const productModel = model("Product", productSchema);
export default productModel;
