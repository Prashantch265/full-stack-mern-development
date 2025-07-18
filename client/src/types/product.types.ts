/**
 * Interface for a single product image.
 * This matches the structure stored in our backend.
 */
export interface IProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

/**
 * Interface for a single Product document returned from our API.
 * It includes all the necessary fields for the UI, plus the calculated orderCount.
 */
export interface IProduct {
  _id: string; // MongoDB's unique identifier
  productId: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  images: IProductImage[];
  orderCount: number; // The calculated count of orders this product is in
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the pagination metadata included in API responses.
 */
export interface IPaginationInfo {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
}

/**
 * Interface for the complete, paginated API response for products.
 * This is the shape of the data our `useApi` hook will receive.
 */
export interface IPaginatedProductsResponse {
  data: IProduct[];
  pagination: IPaginationInfo;
}
