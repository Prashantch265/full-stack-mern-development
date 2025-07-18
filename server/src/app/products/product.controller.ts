import { Request, Response, NextFunction } from "express";
import * as productService from './product.service';
import { successResponse } from "../../utils";

/**
 * Controller to handle fetching all products.
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: productService.IProductQuery = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as "name" | "price",
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };

    const products = await productService.getProducts(query);

    return successResponse(res, products, "Products fetched successfully", "Product");

  } catch (error) {
    next(error);
  }
};
