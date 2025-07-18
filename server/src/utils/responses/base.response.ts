/**
 * Represents a standardized success response with a generic data payload.
 */
export class SuccessResponse<T> {
  public readonly success: boolean = true;
  public status: number = 200;
  public message: string = "";
  public data: T | null = null;
  public source: string = "";
  public pagination: object | null = null;

  // Constructor is now parameterless to allow for manual property assignment.
  constructor() {}
}

/**
 * Represents a standardized error response.
 */
export class ErrorResponse {
  public readonly success: boolean = false;

  constructor(
    public status: number,
    public message: string,
    public source: string
  ) {}
}