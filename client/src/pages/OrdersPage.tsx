import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import type {
  IPaginatedOrdersResponse,
  IOrder,
} from "../types/order.types";
import OrderListItem from "../components/orders/OrderListItem";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import type { AxiosRequestConfig } from "axios";

const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for UI controls, initialized from URL search params
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || ""
  );
  const [page, setPage] = useState(
    () => parseInt(searchParams.get("page") || "1", 10)
  );
  // Get the productId from the URL once on initial render
  const [productId] = useState(() => searchParams.get("productId") || "");

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: orderResponse,
    loading,
    error,
    request: fetchOrders,
  } = useApi<IPaginatedOrdersResponse>();

  // This useEffect is now ONLY responsible for fetching data
  useEffect(() => {
    const params: AxiosRequestConfig["params"] = {
      page,
      limit: 10,
      sortBy: "date_created",
      sortOrder: "desc",
    };
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (statusFilter) params.status = statusFilter;
    if (productId) params.productId = productId;

    fetchOrders({
      method: "GET",
      url: "/orders",
      params,
    });
  }, [debouncedSearchTerm, statusFilter, page, productId, fetchOrders]);

  // This separate useEffect is ONLY responsible for updating the URL
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (debouncedSearchTerm) newSearchParams.set("search", debouncedSearchTerm);
    if (statusFilter) newSearchParams.set("status", statusFilter);
    if (page > 1) newSearchParams.set("page", page.toString());
    if (productId) newSearchParams.set("productId", productId);

    // Use 'replace: true' to avoid cluttering browser history
    setSearchParams(newSearchParams, { replace: true });
  }, [debouncedSearchTerm, statusFilter, page, productId, setSearchParams]);

  const totalPages = orderResponse?.pagination?.totalPages || 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage all synced orders.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by ID, name, email..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order List */}
        {loading && <p className="text-center">Loading orders...</p>}
        {error && (
          <p className="text-center text-red-500">
            Error fetching orders: {error.message}
          </p>
        )}
        {!loading && !error && (
          <div>
            {orderResponse?.data.map((order) => (
              <OrderListItem
                key={order._id}
                order={order}
                onViewDetailsClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}
        {!loading && orderResponse?.data.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 mx-1 bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-4 py-2 mx-1 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrdersPage;
