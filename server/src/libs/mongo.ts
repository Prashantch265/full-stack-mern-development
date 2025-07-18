/**
 * MongoDB Connection Module
 * This module establishes and manages the connection to the MongoDB database using Mongoose.
 * It includes retry logic, event listeners for connection status, and structured logging.
 *
 * Dependencies:
 * - mongoose: ODM library for MongoDB.
 * - config: Typed configuration object.
 * - logger: Winston logger for structured logging.
 */

import mongoose from 'mongoose';
import config from '../configs/config';
import { logger } from '../utils';

/**
 * Connects to the MongoDB database with retry logic.
 * It uses the URI from the configuration file and sets up event listeners
 * to monitor the connection lifecycle.
 */
const connectToDatabase = async (): Promise<void> => {
  // This is the crucial check: If Jest is running, NODE_ENV will be 'test'.
  // In that case, we skip this connection entirely.
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  try {
    // Mongoose v6+ no longer requires the useNewUrlParser and useUnifiedTopology options.
    await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds of trying to connect
    });
  } catch (err) {
    logger.error("MongoDB connection error. Retrying in 5 seconds...", err);
    setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
  }
};

// --- Mongoose Connection Event Listeners ---

// On successful connection
mongoose.connection.on("connected", () => {
  if (process.env.NODE_ENV !== 'test')
  logger.info("MongoDB connection established successfully.");
});

// On connection error
mongoose.connection.on("error", (err) => {
  if (process.env.NODE_ENV !== 'test')
  logger.error("MongoDB connection error:", err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  if (process.env.NODE_ENV !== 'test')
  logger.warn("MongoDB connection lost.");
});

// When the connection is re-established
mongoose.connection.on("reconnected", () => {
  if (process.env.NODE_ENV !== 'test')
  logger.info("MongoDB connection has been re-established.");
});

// Initial connection attempt
connectToDatabase();


// Export the mongoose instance to be used throughout the application
export default mongoose;
