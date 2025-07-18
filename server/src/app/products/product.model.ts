import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface representing a single image for a product.
 */
interface IProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

/**
 * Interface for the Product document.
 * This defines the structure of a product object, extending Mongoose's Document.
 */
export interface IProduct extends Document {
  productId: number; // The original ID from WooCommerce
  name: string;
  slug: string;
  sku: string;
  price: string;
  images: IProductImage[];
  // Timestamps will be added by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema for Products.
 */
const ProductSchema: Schema<IProduct> = new Schema(
  {
    // The unique identifier from the WooCommerce store.
    // This is crucial for checking if a product already exists during sync.
    productId: {
      type: Number,
      required: true,
      unique: true,
      index: true, // Index for faster lookups
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: String,
      required: true,
    },
    // Storing only the necessary image fields as required by the frontend.
    images: [
      {
        id: Number,
        src: String,
        name: String,
        alt: String,
      },
    ],
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

/**
 * Mongoose Model for Products.
 */
const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
