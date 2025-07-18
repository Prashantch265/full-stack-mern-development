import { Router } from "express";
import productRoutes from "./products/product.route";
import orderRoutes from "./orders/order.route";

const router = Router();

// Mount the product routes under the /products path
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;