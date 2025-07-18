import mongoose from 'mongoose';
import { logger } from '../../utils';
import Order from '../orders/order.model';
import Product from '../products/product.model';
import { fetchProductByIdFromWooCommerce, fetchOrdersFromWooCommerce } from '../woocommerce/woocommerce.service';

// Interface for a line item object from WooCommerce
interface IWooCommerceLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: string;
  price: string;
}

// Interface for the processed line item we will store
interface IProcessedLineItem extends IWooCommerceLineItem {
  localProductId: mongoose.Types.ObjectId;
}

/**
 * Checks if a product exists locally, fetches it from WooCommerce if not, and saves it.
 * @param {IWooCommerceLineItem} lineItem - A line item from a WooCommerce order.
 * @returns {Promise<mongoose.Types.ObjectId | null>} The local product's MongoDB _id or null if an error occurs.
 */
const getOrSyncProduct = async (
  lineItem: IWooCommerceLineItem
): Promise<mongoose.Types.ObjectId | null> => {
  try {
    // Check if the product already exists in our local database
    const existingProduct = await Product.findOne({
      productId: lineItem.product_id,
    });

    if (existingProduct) {
      logger.info(`Product ${lineItem.name} already exists locally.`);
      // Explicitly cast _id to the correct type to resolve the error
      return existingProduct._id as mongoose.Types.ObjectId;
    }

    // If product doesn't exist, fetch it from WooCommerce
    logger.info(
      `Product ${lineItem.name} not found locally. Fetching from WooCommerce...`
    );
    const wooProduct = await fetchProductByIdFromWooCommerce(
      lineItem.product_id
    );

    // Create a new product document
    const newProduct = new Product({
      productId: wooProduct.id,
      name: wooProduct.name,
      slug: wooProduct.slug,
      sku: wooProduct.sku,
      price: wooProduct.price,
      images: wooProduct.images.map((img: any) => ({
        id: img.id,
        src: img.src,
        name: img.name,
        alt: img.alt,
      })),
    });

    await newProduct.save();
    logger.info(`Successfully saved new product: ${newProduct.name}`);
    // Explicitly cast _id to the correct type
    return newProduct._id as mongoose.Types.ObjectId;
  } catch (error) {
    logger.error(
      `Error processing product with ID ${lineItem.product_id}:`,
      error
    );
    return null; // Return null to indicate failure for this product
  }
};

/**
 * The main synchronization engine. Fetches orders from WooCommerce and syncs them
 * to the local MongoDB database.
 */
export const syncWooCommerceData = async (): Promise<void> => {
  logger.info("Starting WooCommerce data synchronization...");

  try {
    const orders = await fetchOrdersFromWooCommerce();

    if (!orders || orders.length === 0) {
      logger.info("No new orders to sync.");
      return;
    }

    // Process each order one by one
    for (const order of orders) {
      // Explicitly type the array to prevent the 'never[]' issue
      const processedLineItems: IProcessedLineItem[] = [];
      let canProcessOrder = true;

      // Process all line items for the current order
      for (const item of order.line_items as IWooCommerceLineItem[]) {
        const localProductId = await getOrSyncProduct(item);
        if (localProductId) {
          processedLineItems.push({
            id: item.id,
            name: item.name,
            product_id: item.product_id,
            quantity: item.quantity,
            total: item.total,
            price: item.price,
            localProductId: localProductId,
          });
        } else {
          // If any product fails to sync, we cannot save the order correctly.
          logger.warn(
            `Skipping order #${order.number} because product with ID ${item.product_id} could not be synced.`
          );
          canProcessOrder = false;
          break; // Exit the line_items loop for this order
        }
      }

      if (!canProcessOrder) {
        continue; // Move to the next order
      }

      // Prepare the order document for saving/updating
      const orderData = {
        oid: order.id,
        number: order.number,
        order_key: order.order_key,
        status: order.status,
        date_created: order.date_created,
        total: order.total,
        customer_id: order.customer_id,
        customer_note: order.customer_note,
        billing: order.billing,
        shipping: order.shipping,
        line_items: processedLineItems,
      };

      // Use findOneAndUpdate with upsert to create or update the order
      await Order.findOneAndUpdate({ oid: order.id }, orderData, {
        upsert: true, // Create the document if it doesn't exist
        new: true, // Return the new document
        runValidators: true,
      });

      logger.info(`Successfully synced order #${order.number}`);
    }

    logger.info("WooCommerce data synchronization finished successfully.");
  } catch (error) {
    logger.error("A critical error occurred during the sync process:", error);
  }
};

/**
 * Deletes orders older than 3 months and any products that become orphaned as a result.
 */
export const cleanupOldData = async (): Promise<void> => {
  logger.info("Starting cleanup of old data...");
  try {
    // 1. Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    logger.info(`Looking for records older than ${threeMonthsAgo.toISOString()}`);

    // 2. Find all orders to be deleted
    const oldOrders = await Order.find({
      updatedAt: { $lt: threeMonthsAgo },
    }).select("line_items.localProductId");

    if (oldOrders.length === 0) {
      logger.info("No old orders found to delete.");
      return;
    }

    logger.info(`Found ${oldOrders.length} orders to delete.`);

    // 3. Collect all unique product IDs from the orders about to be deleted
    const productIdsFromDeletedOrders = new Set<string>();
    oldOrders.forEach((order) => {
      order.line_items.forEach((item) => {
        if (item.localProductId) {
          productIdsFromDeletedOrders.add(item.localProductId.toString());
        }
      });
    });

    // 4. Delete the old orders
    const deleteResult = await Order.deleteMany({
      updatedAt: { $lt: threeMonthsAgo },
    });
    logger.info(`Successfully deleted ${deleteResult.deletedCount} old orders.`);

    // 5. Find which products are now orphaned
    const orphanProductIds: string[] = [];
    for (const productId of Array.from(productIdsFromDeletedOrders)) {
      const isReferenced = await Order.findOne({
        "line_items.localProductId": new mongoose.Types.ObjectId(productId),
      });
      // If no other order references this product, it's an orphan
      if (!isReferenced) {
        orphanProductIds.push(productId);
      }
    }

    // 6. Delete the orphaned products
    if (orphanProductIds.length > 0) {
      logger.info(`Found ${orphanProductIds.length} orphaned products to delete.`);
      const productDeleteResult = await Product.deleteMany({
        _id: { $in: orphanProductIds },
      });
      logger.info(
        `Successfully deleted ${productDeleteResult.deletedCount} orphaned products.`
      );
    } else {
      logger.info("No orphaned products found to delete.");
    }

    logger.info("Cleanup of old data finished successfully.");
  } catch (error) {
    logger.error("A critical error occurred during the cleanup process:", error);
  }
};