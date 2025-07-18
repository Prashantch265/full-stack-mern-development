import mongoose, { Document, Schema, Model } from "mongoose";
import { IProduct } from "../products/product.model";

/**
 * Interface for the billing and shipping address information.
 */
interface IAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string; // Email is optional for shipping
  phone?: string; // Phone is optional for shipping
}

/**
 * Interface for a single line item within an order.
 * It references a product in our local database.
 */
interface ILineItem {
  id: number;
  name: string;
  product_id: number; // The original WooCommerce product ID
  quantity: number;
  total: string;
  price: string;
  // Reference to our local Product document
  localProductId: mongoose.Schema.Types.ObjectId | IProduct;
}

/**
 * Interface for the Order document.
 */
export interface IOrder extends Document {
  oid: number; // The original ID from WooCommerce
  number: string;
  order_key: string;
  status: string;
  date_created: Date;
  total: string;
  customer_id: number;
  customer_note: string;
  billing: IAddress;
  shipping: IAddress;
  line_items: ILineItem[];
  // Timestamps will be added by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema for Orders.
 */
const OrderSchema: Schema<IOrder> = new Schema(
  {
    // The unique order ID from WooCommerce.
    oid: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
    },
    order_key: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      index: true, // Index for faster filtering by status
    },
    date_created: {
      type: Date,
      required: true,
      index: true, // Index for sorting by date
    },
    total: {
      type: String,
      required: true,
    },
    customer_id: {
      type: Number,
      default: 0,
    },
    customer_note: {
      type: String,
      default: "",
    },
    billing: {
      type: Object,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    line_items: [
      {
        id: Number,
        name: String,
        product_id: Number,
        quantity: Number,
        total: String,
        price: String,
        // This creates the reference to our local Product collection
        localProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose Model for Orders.
 */
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
