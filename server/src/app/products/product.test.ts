import request from 'supertest';
import app from '../../app'; // The main Express app
import Product from './product.model'; // The Mongoose Product model

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    // Test case: should return a list of products with a 200 status code
    it('should return a paginated list of products', async () => {
      // 1. Setup: Insert mock data into the in-memory database
      const mockProducts = [
        {
          productId: 101,
          name: 'Test Product A',
          sku: 'TPA-01',
          price: '19.99',
          images: [],
        },
        {
          productId: 102,
          name: 'Test Product B',
          sku: 'TPB-02',
          price: '29.99',
          images: [],
        },
      ];
      await Product.insertMany(mockProducts);

      // 2. Action: Make a request to the API endpoint
      const response = await request(app).get('/api/products');

      // 3. Assertion: Verify the response structure
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Corrected: The product array is directly in `response.body.data`
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toBe('Test Product A');
      // Corrected: The pagination object is at the top level of the response
      expect(response.body.pagination.totalRecords).toBe(2);
    });

    // Test case: should return an empty list when no products exist
    it('should return an empty list if no products are in the database', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      // Corrected paths
      expect(response.body.data.length).toBe(0);
      expect(response.body.pagination.totalRecords).toBe(0);
    });

    // Test case: should handle searching correctly
    it('should return filtered products based on a search query', async () => {
        const mockProducts = [
            { productId: 201, name: 'Cool Hat', sku: 'CH-01', price: '15.00' },
            { productId: 202, name: 'Warm Scarf', sku: 'WS-01', price: '25.00' },
        ];
        await Product.insertMany(mockProducts);

        const response = await request(app).get('/api/products?search=Hat');

        expect(response.status).toBe(200);
        // Corrected paths
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Cool Hat');
    });
  });
});
