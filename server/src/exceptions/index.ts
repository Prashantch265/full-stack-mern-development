/**
 * HttpException: Base class for HTTP exceptions.
 * Use this when you want to create a custom exception with an HTTP status code and message.
 */
export class HttpException extends Error {
  constructor(
    public status: number, // HTTP status code (e.g., 404, 500)
    public message: string, // Error message
    public source: any | null = null // Optional details about the error source
  ) {
    super(message); // Call the base class constructor
  }
}

/**
 * AuthException: For Authentication or Authorization errors.
 * Use this when users fail to authenticate or are unauthorized to access certain resources.
 */
export class AuthException extends HttpException {
  constructor(
    message: string = "Authentication/Authorization error",
    source: any | null = null
  ) {
    super(401, message, source); // 401 - Unauthorized
  }
}

/**
 * ValidationException: For Input validation errors.
 * Use this when the user provides invalid data that doesn't meet validation criteria.
 */
export class ValidationException extends HttpException {
  constructor(message: string = "Validation failed", source: any | null = null) {
    super(400, message, source); // 400 - Bad Request
  }
}

/**
 * DatabaseException: For Database-related errors.
 * Use this when there are issues like connection failures, query errors, or transaction problems.
 */
export class DatabaseException extends HttpException {
  constructor(message: string = "Database error", source: any | null = null) {
    super(500, message, source); // 500 - Internal Server Error
  }
}

/**
 * NotFoundException: For when a requested resource is not found.
 * Use this for 404 errors, like when a database query returns no results.
 */
export class NotFoundException extends HttpException {
  constructor(message: string = "Resource not found", source: any | null = null) {
    super(404, message, source); // 404 - Not Found
  }
}

/**
 * ForbiddenException: For when a user is authenticated but lacks permissions.
 * Use this for 403 errors when a user tries to access a resource they don't have rights to.
 */
export class ForbiddenException extends HttpException {
  constructor(message: string = "Access denied", source: any | null = null) {
    super(403, message, source); // 403 - Forbidden
  }
}

/**
 * ConflictException: For data conflicts, like duplicate resources.
 * Use this for 409 errors, such as trying to create a record that already exists.
 */
export class ConflictException extends HttpException {
  constructor(message: string = "Conflict occurred", source: any | null = null) {
    super(409, message, source); // 409 - Conflict
  }
}

/**
 * BadGatewayException: For issues with external services or APIs.
 * Use this for 502 errors when an upstream service fails.
 */
export class BadGatewayException extends HttpException {
  constructor(message: string = "Bad Gateway", source: any | null = null) {
    super(502, message, source); // 502 - Bad Gateway
  }
}

/**
 * ServiceUnavailableException: For when the server or an external service is unavailable.
 * Use this for 503 errors when a service is temporarily down or overloaded.
 */
export class ServiceUnavailableException extends HttpException {
  constructor(
    message: string = "Service Unavailable",
    source: any | null = null
  ) {
    super(503, message, source); // 503 - Service Unavailable
  }
}