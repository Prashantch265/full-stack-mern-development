import { Request, Response, NextFunction } from "express";
import { NotFoundException, ValidationException } from "../../exceptions";
import { successResponse } from "../../utils";
import * as orderService from './order.service';

/**
 * Controller to handle fetching all orders.
 */
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: orderService.IOrderQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: req.query.search as string,
      status: req.query.status as string,
      sortBy: req.query.sortBy as "total" | "date_created",
      sortOrder: req.query.sortOrder as "asc" | "desc",
      productId: req.query.productId as string,
    };

    const orders = await orderService.getOrders(query);

    return successResponse(res, orders, "Orders fetched successfully", "Order");
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle fetching a single order by its WooCommerce Order ID (oid).
 */
export const getOrderByOid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oid = parseInt(req.params.oid, 10);
    if (isNaN(oid)) {
      throw new ValidationException("Order ID must be a number.");
    }

    const order = await orderService.getOrderByOid(oid);
    if (!order) {
      throw new NotFoundException("Order not found.");
    }
    return successResponse(res, order, "Order fetched successfully", "Order");
  } catch (error) {
    next(error);
  }
};
