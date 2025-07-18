/**
 * Interface defining the structure of pagination parameters.
 */
export interface IPaginationParams {
  limit: number;
  offset: number;
  sortOrder: "ASC" | "DESC";
  sortBy: string;
}

/**
 * Interface for the pagination metadata in a response.
 */
export interface IPaginationInfo {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
}

/**
 * Interface for a standardized paginated response.
 * Uses a generic type <T> for the data array.
 */
export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPaginationInfo;
}

/**
 * Helper function to generate pagination details from query parameters.
 * @param {string | number} pageNo - The current page number.
 * @param {string | number} size - Number of items per page.
 * @param {string} sort - Sorting order, 'asc' or 'desc'.
 * @param {string} sortBy - The field to sort by.
 * @returns {IPaginationParams} An object with limit, offset, sortOrder, and sortBy.
 */
export const getPaginationParams = (
  pageNo: string | number = 1,
  size: string | number = 10,
  sort: string = "desc",
  sortBy: string = "createdAt"
): IPaginationParams => {
  const page = Math.max(1, typeof pageNo === 'string' ? parseInt(pageNo, 10) : pageNo);
  const limit = Math.max(1, typeof size === 'string' ? parseInt(size, 10) : size);
  const offset = (page - 1) * limit;
  const sortOrder = sort.toLowerCase() === "asc" ? "ASC" : "DESC";

  return { limit, offset, sortOrder, sortBy };
};

/**
 * Formats data into a standardized paginated response object.
 * @param {number} totalRecords - Total number of records in the database.
 * @param {T[]} data - The array of data fetched for the current page.
 * @param {number} limit - Number of items per page.
 * @param {number} offset - The starting offset for the current page.
 * @returns {IPaginatedResponse<T>} A structured paginated response object.
 */
export const formatPaginatedResponse = <T>(
  totalRecords: number,
  data: T[],
  limit: number,
  offset: number
): IPaginatedResponse<T> => {
  const totalPages = Math.ceil(totalRecords / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNext = offset + limit < totalRecords;

  return {
    data,
    pagination: {
      totalRecords,
      totalPages,
      currentPage,
      hasNext,
    },
  };
};
