import request from 'supertest';
import app from '../../app';
import Product from '../products/product.model';
import Order from './order.model';

describe('Order Routes', () => {
  let sampleProduct: any;

  // beforeEach ensures a fresh product is created for each test,
  // after the database is cleared by the global beforeEach hook.
  beforeEach(async () => {
    sampleProduct = await new Product({
      productId: 999,
      name: 'Sample Test Product',
      sku: 'STP-999',
      price: '10.00',
    }).save();
  });

  describe('GET /api/orders', () => {
    // Test case: should return a list of all orders
    it('should return a paginated list of orders', async () => {
      // 1. Setup: Insert mock order data
      await Order.create({
        oid: 201,
        number: 'ORDER-201',
        order_key: 'wc_order_mock_key_201',
        status: 'completed',
        date_created: new Date(),
        total: '10.00',
        billing: { first_name: 'John', last_name: 'Doe' },
        shipping: { first_name: 'John', last_name: 'Doe' },
        line_items: [{
          product_id: 999,
          name: 'Sample Test Product',
          quantity: 1,
          total: '10.00',
          price: '10.00',
          localProductId: sampleProduct._id,
        }],
      });

      // 2. Action: Make the API request
      const response = await request(app).get('/api/orders');

      // 3. Assertion: Verify the response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].number).toBe('ORDER-201');
    });

    // Test case: should filter orders by status
    it('should return orders filtered by status', async () => {
      await Order.insertMany([
        {
          oid: 301,
          number: 'ORDER-301',
          order_key: 'wc_order_mock_key_301',
          status: 'completed',
          date_created: new Date(),
          total: '20.00',
          billing: { first_name: 'Jane', last_name: 'Smith' },
          shipping: { first_name: 'Jane', last_name: 'Smith' },
          line_items: [{ product_id: 999, name: 'Sample Test Product', quantity: 1, total: '20.00', price: '20.00', localProductId: sampleProduct._id }],
        },
        {
          oid: 302,
          number: 'ORDER-302',
          order_key: 'wc_order_mock_key_302',
          status: 'processing',
          date_created: new Date(),
          total: '30.00',
          billing: { first_name: 'Peter', last_name: 'Jones' },
          shipping: { first_name: 'Peter', last_name: 'Jones' },
          line_items: [{ product_id: 999, name: 'Sample Test Product', quantity: 1, total: '30.00', price: '30.00', localProductId: sampleProduct._id }],
        },
      ]);

      const response = await request(app).get('/api/orders?status=processing');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].status).toBe('processing');
    });

    // Test case: should return an empty list when no orders match the filter
    it('should return an empty list if no orders match the query', async () => {
        const response = await request(app).get('/api/orders?status=nonexistent');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
    });
  });
});
