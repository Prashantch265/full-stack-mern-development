import React, { useState } from "react";
import ProductList from "../components/products/ProductList";
import { useDebounce } from "../hooks/useDebounce";
import type { IPaginatedProductsResponse } from "../types/product.types";
import { useApi } from "../hooks/useApi";

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // We need to fetch the data here to know about pagination
  const { data: productResponse } = useApi<IPaginatedProductsResponse>();

  const totalPages = productResponse?.pagination?.totalPages || 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">
            Browse, search, and sort through all synced products.
          </p>
        </div>

        {/* Controls: Search and Sort */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price")}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Product List */}
        <ProductList
          searchTerm={debouncedSearchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          page={page}
        />

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 mx-1 bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 mx-1 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
