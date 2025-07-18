import React from "react";
import type { IOrder } from "../../types/order.types"; // Corrected path

// Define the props for the component
interface OrderListItemProps {
  order: IOrder;
  onViewDetailsClick: (order: IOrder) => void;
}

/**
 * A component to display a summary of a single order in a list.
 */
const OrderListItem: React.FC<OrderListItemProps> = ({
  order,
  onViewDetailsClick,
}) => {
  // Function to get a color based on the order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={() => onViewDetailsClick(order)}
      className="bg-white rounded-lg shadow-sm mb-4 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        {/* Order Info */}
        <div className="flex-grow mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-indigo-600">
            Order #{order.number}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Billed to:{" "}
            <span className="font-medium">
              {order.billing.first_name} {order.billing.last_name}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Placed on:{" "}
            {new Date(order.date_created).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Status and Total */}
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <p className="text-xl font-bold text-gray-800 mt-2">
            ${parseFloat(order.total).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderListItem;
