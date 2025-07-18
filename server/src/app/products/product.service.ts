import { getPaginationParams, formatPaginatedResponse } from "../../utils";
import { IPaginatedResponse } from "../../utils/helpers/pagination";
import Product, { IProduct } from "./product.model";


// Interface for the query parameters the controller will pass
export interface IProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
}

// The shape of the product data returned by our service
export interface IProductWithOrderCount extends IProduct {
  orderCount: number;
}

/**
 * Fetches a paginated list of products with their associated order counts.
 * @param {IProductQuery} query - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<IPaginatedResponse<IProductWithOrderCount>>} A paginated response of products.
 */
export const getProducts = async (
  query: IProductQuery
): Promise<IPaginatedResponse<IProductWithOrderCount>> => {
  const { search, sortBy = "name", sortOrder = "asc" } = query;
  const { limit, offset } = getPaginationParams(
    query.page,
    query.limit
  );

  // Build the aggregation pipeline
  const pipeline: any[] = [];

  // Filter based on search query (name or SKU)
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive search
          { sku: { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // Join with the 'orders' collection to count orders
  pipeline.push({
    $lookup: {
      from: "orders", // The name of the orders collection
      localField: "_id",
      foreignField: "line_items.localProductId",
      as: "orders",
    },
  });

  // Add the orderCount field
  pipeline.push({
    $addFields: {
      orderCount: { $size: "$orders" },
    },
  });

  // Select the final fields to return
  pipeline.push({
    $project: {
      orders: 0, // Exclude the temporary 'orders' array
    },
  });

  // Sort the results
  pipeline.push({
    $sort: {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    },
  });

  // For pagination and getting total count
  pipeline.push({
    $facet: {
      metadata: [{ $count: "totalRecords" }],
      data: [{ $skip: offset }, { $limit: limit }],
    },
  });

  const result = await Product.aggregate(pipeline);

  const data = result[0].data;
  const totalRecords = result[0].metadata[0] ? result[0].metadata[0].totalRecords : 0;

  return formatPaginatedResponse(totalRecords, data, limit, offset);
};
