import mongoose from "mongoose";
import { getPaginationParams, formatPaginatedResponse } from "../../utils";
import { IPaginatedResponse } from "../../utils/helpers/pagination";
import Order, { IOrder } from "./order.model";


// Interface for the query parameters from the controller
export interface IOrderQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "total" | "date_created";
  sortOrder?: "asc" | "desc";
  productId?: string;
}

/**
 * Fetches a paginated list of orders based on query parameters.
 */
export const getOrders = async (
  query: IOrderQuery
): Promise<IPaginatedResponse<IOrder>> => {
  const {
    search,
    status,
    sortBy = "date_created",
    sortOrder = "desc",
    productId,
  } = query;
  const { limit, offset } = getPaginationParams(query.page, query.limit);

  const matchStage: any = { $and: [] };

  if (status) {
    matchStage.$and.push({ status: status });
  }

  if (productId && mongoose.Types.ObjectId.isValid(productId)) {
    matchStage.$and.push({
      "line_items.localProductId": new mongoose.Types.ObjectId(productId),
    });
  }

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    const searchConditions: any[] = [
      { number: searchRegex },
      { "billing.first_name": searchRegex },
      { "billing.last_name": searchRegex },
      { "billing.email": searchRegex },
      { "shipping.first_name": searchRegex },
      { "shipping.last_name": searchRegex },
      { "shipping.address_1": searchRegex },
      { "line_items.name": searchRegex },
    ];
    if (!isNaN(Number(search))) {
      searchConditions.push({ oid: Number(search) });
    }
    matchStage.$and.push({ $or: searchConditions });
  }

  if (matchStage.$and.length === 0) {
    delete matchStage.$and;
  }

  const aggregationPipeline: any[] = [
    { $match: matchStage },
    { $unwind: "$line_items" },
    {
      $lookup: {
        from: "products",
        localField: "line_items.localProductId",
        foreignField: "_id",
        as: "line_items.productDetails",
      },
    },
    { $unwind: "$line_items.productDetails" },
    {
      $group: {
        _id: "$_id",
        oid: { $first: "$oid" },
        number: { $first: "$number" },
        status: { $first: "$status" },
        date_created: { $first: "$date_created" },
        total: { $first: "$total" },
        billing: { $first: "$billing" },
        shipping: { $first: "$shipping" },
        line_items: { $push: "$line_items" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
    {
      $facet: {
        metadata: [{ $count: "totalRecords" }],
        data: [{ $skip: offset }, { $limit: limit }],
      },
    },
  ];

  const result = await Order.aggregate(aggregationPipeline);

  const data = result[0].data;
  const totalRecords = result[0].metadata[0]
    ? result[0].metadata[0].totalRecords
    : 0;

  return formatPaginatedResponse(totalRecords, data, limit, offset);
};

/**
 * Fetches a single order by its original WooCommerce Order ID (oid).
 * @param {number} oid - The WooCommerce ID of the order.
 * @returns {Promise<IOrder | null>} The order document or null if not found.
 */
export const getOrderByOid = async (oid: number): Promise<IOrder | null> => {
  return Order.findOne({ oid: oid }).populate("line_items.localProductId");
};
