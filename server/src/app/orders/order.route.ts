import { Router } from "express";
import { getAllOrders, getOrderByOid } from "./order.controller";

const router = Router();

/**
 * @route   GET /api/orders
 * @desc    Get all orders with search, filter, sort, and pagination
 * @access  Public
 */
router.get("/", getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by its MongoDB ID
 * @access  Public
 */
router.get("/oid/:oid", getOrderByOid);

export default router;
