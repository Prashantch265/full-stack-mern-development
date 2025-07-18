import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import config from "../../configs/config";
import { logger } from "../../utils";
import { BadGatewayException } from "../../exceptions";

// Initialize the WooCommerce API client with credentials from the config file.
// This instance will be reused for all API calls.
const api = new WooCommerceRestApi({
  url: "https://interview-test.matat.io/", // The store URL
  consumerKey: config.woocommerce.consumerKey,
  consumerSecret: config.woocommerce.consumerSecret,
  version: "wc/v3", // The API version
});

/**
 * Fetches orders from the WooCommerce API.
 * This function specifically gets orders from the last 30 days as per requirements.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of order objects.
 * @throws {BadGatewayException} If the API call fails.
 */
export const fetchOrdersFromWooCommerce = async (): Promise<any[]> => {
  try {
    logger.info("Fetching orders from WooCommerce...");

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const response = await api.get("orders", {
      per_page: 100, // Fetch up to 100 orders per request
      after: thirtyDaysAgo.toISOString(), // Filter for orders created after this date
    });

    if (response.status === 200) {
      logger.info(`Successfully fetched ${response.data.length} orders.`);
      return response.data;
    } else {
      throw new Error(`Failed to fetch orders with status: ${response.status}`);
    }
  } catch (error: any) {
    logger.error("Failed to fetch orders from WooCommerce:", error.message);
    // Throw a specific exception that can be caught by our global error handler
    throw new BadGatewayException(
      "Could not retrieve orders from WooCommerce API.",
      error.message
    );
  }
};

/**
 * Fetches a single product by its ID from the WooCommerce API.
 *
 * @param {number} productId - The ID of the product to fetch.
 * @returns {Promise<any>} A promise that resolves to the product object.
 * @throws {BadGatewayException} If the API call fails.
 */
export const fetchProductByIdFromWooCommerce = async (
  productId: number
): Promise<any> => {
  try {
    logger.info(`Fetching product with ID: ${productId} from WooCommerce...`);

    const response = await api.get(`products/${productId}`);

    if (response.status === 200) {
      logger.info(`Successfully fetched product: ${response.data.name}`);
      return response.data;
    } else {
      throw new Error(
        `Failed to fetch product ${productId} with status: ${response.status}`
      );
    }
  } catch (error: any) {
    logger.error(
      `Failed to fetch product ${productId} from WooCommerce:`,
      error.message
    );
    throw new BadGatewayException(
      `Could not retrieve product ${productId} from WooCommerce API.`,
      error.message
    );
  }
};
