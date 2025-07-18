import React from "react";
import { type IProduct } from "../../types/product.types"; // Adjust the import path as needed

// Define the props interface for the component
interface ProductCardProps {
  product: IProduct;
  onOrderCountClick: (productId: string) => void; // Function to handle click on order count
}

/**
 * A reusable UI component to display a single product in a card format.
 * It shows the product's primary image, name, price, and a clickable order count.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderCountClick,
}) => {
  // Get the first image, or use a placeholder if no images exist.
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].src
      : "https://placehold.co/600x400/eee/ccc?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      {/* Product Image Section */}
      <div className="w-full h-48 bg-gray-200">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback in case the image URL is broken
            e.currentTarget.src =
              "https://placehold.co/600x400/eee/ccc?text=No+Image";
          }}
        />
      </div>

      {/* Product Details Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">SKU: {product.sku || "N/A"}</p>

        {/* Price and Order Count Section */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-bold text-gray-900">${product.price}</p>
          <button
            onClick={() => onOrderCountClick(product._id)}
            className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
            title={`View orders for ${product.name}`}
          >
            Orders: {product.orderCount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
