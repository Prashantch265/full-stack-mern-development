import { Response } from 'express';
import * as util from 'util';
import { SuccessResponse } from './base.response';

/**
 * Interface for a paginated data structure.
 */
interface IPaginatedResult<T> {
    data: T;
    pagination: object;
}

/**
 * Type guard to check if the result object is paginated.
 * @param result The result object to check.
 * @returns True if the result is a paginated object, false otherwise.
 */
function isPaginated<T>(result: any): result is IPaginatedResult<T> {
    return (
        result &&
        typeof result === "object" &&
        "pagination" in result &&
        "data" in result
    );
}

/**
 * Sends a standardized success response to the client.
 *
 * @param res The Express response object.
 * @param result The response data, which can be a direct payload or a paginated result.
 * @param message The key for the success message from the message.json file.
 * @param source The source of the response (e.g., "Product", "Order").
 * @returns The JSON response sent to the client.
 */
const successResponse = <T>(
    res: Response,
    result: T | IPaginatedResult<T>,
    message: string,
    source: string
): Response => {
    if (!result) {
        throw new Error("Result data is required to send a response to the client.");
    }
    if (!message) {
        throw new Error("A message key is required for the response.");
    }

    // Note: This assumes the SuccessResponse class from api.response.ts has a constructor
    // that allows properties to be set manually after instantiation.
    const success = new SuccessResponse<T | T[] | null>();

    success.status = 200;
    success.source = source;
    // Use the message key to get the formatted string, or use the key itself as a fallback.
    success.message = util.format(message, source);

    // Use the type guard to safely handle paginated results
    if (isPaginated<T>(result)) {
        success.data = result.data as T | T[];
        success.pagination = result.pagination;
    } else {
        success.data = result as T | T[];
    }

    return res.status(200).json(success);
};

export default successResponse;