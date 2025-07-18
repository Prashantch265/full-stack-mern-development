import type { IProduct } from "./product.types";
import type { IPaginationInfo } from "./product.types"; // Re-using from product types

/**
 * Interface for the billing and shipping address information.
 */
export interface IAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

/**
 * Interface for a single line item within an order,
 * including the populated product details.
 */
export interface ILineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
  price: string;
  localProductId: string; // The MongoDB _id of the local product
  productDetails: IProduct; // The fully populated product object
}

/**
 * Interface for a single Order document returned from our API.
 */
export interface IOrder {
  _id: string; // MongoDB's unique identifier
  oid: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  billing: IAddress;
  shipping: IAddress;
  line_items: ILineItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the complete, paginated API response for orders.
 */
export interface IPaginatedOrdersResponse {
  data: IOrder[];
  pagination: IPaginationInfo;
}
