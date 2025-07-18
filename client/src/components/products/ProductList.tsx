import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To navigate to the orders page
import { useApi } from "../../hooks/useApi"; // Adjust path as needed
import {
  type IPaginatedProductsResponse,
  type IProduct,
} from "../../types/product.types"; // Adjust path as needed
import ProductCard from "./ProductCard"; // The card component we just created
import { type AxiosRequestConfig } from "axios";

// Define the props for the component
interface ProductListProps {
  searchTerm: string;
  sortBy: "name" | "price";
  sortOrder: "asc" | "desc";
  page: number;
}

/**
 * A component responsible for fetching and displaying a list of products.
 * It handles loading and error states and renders the product cards in a grid.
 */
const ProductList: React.FC<ProductListProps> = ({
  searchTerm,
  sortBy,
  sortOrder,
  page,
}) => {
  const navigate = useNavigate();
  const {
    data: productResponse,
    loading,
    error,
    request: fetchProducts,
  } = useApi<IPaginatedProductsResponse>();

  // This effect re-fetches data whenever the search, sort, or page props change.
  useEffect(() => {
    const params: AxiosRequestConfig["params"] = {
      page,
      limit: 12, // Display 12 products per page
      sortBy,
      sortOrder,
    };
    if (searchTerm) {
      params.search = searchTerm;
    }

    fetchProducts({
      method: "GET",
      url: "/products",
      params,
    });
  }, [searchTerm, sortBy, sortOrder, page]); // Dependency array

  // Handler for when the "Orders" count is clicked on a card
  const handleOrderCountClick = (productId: string) => {
    // Navigate to the orders page, filtering by this product's ID
    navigate(`/orders?productId=${productId}`);
  };

  // Render a loading skeleton UI
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md h-72 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render an error message
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">
          Failed to load products. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  // Render the list of products
  return (
    <div>
      {productResponse && productResponse.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productResponse.data.map((product: IProduct) => (
            <ProductCard
              key={product._id}
              product={product}
              onOrderCountClick={handleOrderCountClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">No products found.</p>
        </div>
      )}
      {/* We will add pagination controls here later */}
    </div>
  );
};

export default ProductList;
