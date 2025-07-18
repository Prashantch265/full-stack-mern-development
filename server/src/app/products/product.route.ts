import { Router } from "express";
import { getAllProducts } from "./product.controller";

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with search, sort, and pagination
 * @access  Public
 */
router.get("/", getAllProducts);

export default router;
