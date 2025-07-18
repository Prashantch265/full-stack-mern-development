import React from "react";
import type { IOrder, IAddress } from "../../types/order.types"; // Corrected path

interface OrderDetailsModalProps {
  order: IOrder | null;
  onClose: () => void;
}

/**
 * A helper component to render an address block.
 */
const AddressBlock: React.FC<{ title: string; address: IAddress }> = ({
  title,
  address,
}) => (
  <div>
    <h4 className="text-md font-semibold text-gray-700 mb-2">{title}</h4>
    <div className="text-sm text-gray-600">
      <p>
        {address.first_name} {address.last_name}
      </p>
      <p>{address.address_1}</p>
      {address.address_2 && <p>{address.address_2}</p>}
      <p>
        {address.city}, {address.state} {address.postcode}
      </p>
      <p>{address.country}</p>
      {address.email && <p className="mt-1">Email: {address.email}</p>}
      {address.phone && <p>Phone: {address.phone}</p>}
    </div>
  </div>
);

/**
 * A modal component to display the full details of a selected order.
 */
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  // If no order is selected, don't render the modal
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Order Details: #{order.number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AddressBlock title="Billing Address" address={order.billing} />
            <AddressBlock title="Shipping Address" address={order.shipping} />
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {order.line_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.productDetails?.images[0]?.src || "https://placehold.co/100x100"}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover bg-gray-100"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-700">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ${parseFloat(item.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      (${parseFloat(item.price).toFixed(2)} each)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-4 border-t flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(order.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
