import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import type { IProduct } from '../../types/product.types';

// Mock product data for our tests
const mockProduct: IProduct = {
  _id: '60d21b4667d0d8992e610c85',
  productId: 101,
  name: 'Elegant Watch',
  slug: 'elegant-watch',
  sku: 'EW-101',
  price: '199.99',
  images: [{ id: 1, src: 'image.jpg', name: 'watch', alt: 'watch' }],
  orderCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ProductCard Component', () => {
  it('should render product details correctly', () => {
    // Render the component with mock data
    render(
      <ProductCard product={mockProduct} onOrderCountClick={() => {}} />
    );

    // Assert that the product name is in the document
    expect(screen.getByText('Elegant Watch')).toBeInTheDocument();

    // Assert that the price is displayed
    expect(screen.getByText('$199.99')).toBeInTheDocument();

    // Assert that the SKU is displayed
    expect(screen.getByText('SKU: EW-101')).toBeInTheDocument();

    // Assert that the order count is correct
    expect(screen.getByText('Orders: 5')).toBeInTheDocument();
  });

  it('should call onOrderCountClick when the orders button is clicked', () => {
    // Create a mock function (a "spy") to track calls
    const handleOrderClick = vi.fn();

    render(
      <ProductCard product={mockProduct} onOrderCountClick={handleOrderClick} />
    );

    // Find the button by its text content
    const ordersButton = screen.getByText('Orders: 5');

    // Simulate a user click
    fireEvent.click(ordersButton);

    // Assert that our mock function was called exactly once
    expect(handleOrderClick).toHaveBeenCalledTimes(1);

    // Assert that it was called with the correct product ID
    expect(handleOrderClick).toHaveBeenCalledWith(mockProduct._id);
  });

  it('should display a placeholder if no image is available', () => {
    // Create a product with an empty images array
    const productWithoutImage = { ...mockProduct, images: [] };

    render(
      <ProductCard product={productWithoutImage} onOrderCountClick={() => {}} />
    );

    // Find the image element and check its src attribute
    const image = screen.getByRole('img') as HTMLImageElement;
    expect(image.src).toContain('placehold.co');
  });
});
