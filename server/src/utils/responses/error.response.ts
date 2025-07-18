import { ErrorResponse } from './base.response';

/**
 * Creates a standardized error response object.
 *
 * @param {number} status - The HTTP status code for the error.
 * @param {string} message - The error message for the client.
 * @param {string} source - The source of the error (e.g., "Validation", "Database").
 * @returns {ErrorResponse} An instance of the ErrorResponse class.
 */
const errorResponse = (
  status: number,
  message: string,
  source: string
): ErrorResponse => {
  if (!status) {
    throw new Error("HTTP status code is required for an error response.");
  }
  if (!message) {
    throw new Error("A message is required for an error response.");
  }

  // Directly use the constructor to create and return the error object.
  return new ErrorResponse(status, message, source);
};

export default errorResponse;