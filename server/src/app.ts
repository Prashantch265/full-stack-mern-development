/**
 * Main Application Setup File
 * This file initializes the Express server, configures middleware, connects to the database,
 * and sets up routing and error handling.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import hpp from 'hpp';
import morgan from 'morgan';


import { HttpException } from './exceptions';
import { logger, errorResponse } from './utils';
import mainRouter from './app/index';

// --- Database Connection ---
// Initialize the MongoDB connection. The logic is self-contained in the imported file.
import "./libs/mongo";

/**
 * Initialize Express App
 */
const app: Application = express();

const NODE_ENV = process.env.NODE_ENV ?? 'local';

/**
 * Middleware for Different Environments
 */
if (NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "*", // Allow all origins for development
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
  app.use(morgan("dev")); // Use 'dev' format for logging in development
} else {
  app.use(morgan("combined")); // Use 'combined' format for production
  // Configure CORS for production (e.g., restrict to your frontend's domain)
  // app.use(cors({ origin: 'https://your-frontend.com' }));
  app.use(cors()); // Default CORS for now
}

/**
 * Express App Setup: Core Middleware
 */
app.set("trust proxy", 1); // Trust first proxy
app.use(hpp()); // Protect against HTTP Parameter Pollution attacks
app.use(helmet()); // Set various security-related HTTP headers
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse Cookie header and populate req.cookies
app.use(compression()); // Compress response bodies for faster performance

/**
 * Initialize Application Routes
 * A more modern approach is to import and use a main router.
 */
app.use('/api', mainRouter);

/**
 * Simple GET route for health check / testing
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

/**
 * 404 Error Handler
 * This middleware is triggered if no other route matches the request.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new HttpException(404, "Not Found");
  next(err);
});

/**
 * Global Error Handling Middleware
 * This catches all errors passed to `next()` and sends a standardized JSON response.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = err.status || 500;
    const message: string = err.message || "Something went wrong";

    let errorObj;

    // Log all errors
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode: ${status}, Message: ${message}\nStack: ${err.stack}`
    );

    // Create a standardized error response object
    if (err instanceof HttpException) {
      errorObj = errorResponse(
        status,
        message,
        err.source || `[${req.method}] ${req.path}`
      );
    } else {
      // For generic errors, create a generic response
      errorObj = errorResponse(
        status,
        message,
        `[${req.method}] ${req.path}`
      );
    }

    return res.status(errorObj.status).json(errorObj);
  } catch (error) {
    // If the error handler itself fails, pass to Express's default handler
    next(error);
  }
});

export default app;
