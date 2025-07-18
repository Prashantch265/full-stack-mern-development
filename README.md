# WooCommerce Data Sync & Display (MERN Stack)

This is a full-stack MERN application built to fulfill the requirements of a developer assessment task. The application synchronizes orders and products from a live WooCommerce store into a local MongoDB database and provides a clean, interactive React interface to view, search, and filter the synchronized data.

## Features

### Backend (Server)

* **Automated Data Sync:** A cron job runs on a configurable schedule (defaulting to 12:00 PM daily) to fetch the latest orders from the WooCommerce API.
* **Intelligent Product Syncing:** Only fetches product information if the product does not already exist in the local database, preventing redundant API calls.
* **Automated Data Cleanup:** A separate cron job runs (defaulting to 1:00 AM daily) to automatically delete orders older than 3 months.
* **Orphaned Product Removal:** When an old order is deleted, the system checks if any of its associated products are now "orphaned" (not part of any other order) and deletes them as well.
* **Robust Error Handling:** The application includes structured logging with Winston and custom exceptions to gracefully handle API failures or bad responses.
* **RESTful API:** A well-defined API built with Express.js for the frontend to consume, with support for searching, sorting, filtering, and pagination.
* **Unit Tested:** The backend API endpoints are tested using Jest and Supertest to ensure reliability.

### Frontend (Client)

* **Products Page:**
  * Displays a list of all synced products in a clean, responsive card-based grid using Tailwind CSS.
  * Searchable by product name or SKU with debouncing for a smooth user experience.
  * Sortable by product name or price (ascending/descending).
  * Displays the first available image for each product with a placeholder fallback.
  * Shows a clickable "Orders" count for each product, which navigates to a filtered view of the Orders Page.
* **Orders Page:**
  * Displays a list of all synced orders, showing the most recent first.
  * Searchable by order ID, number, customer billing/shipping info, or product name.
  * Filterable by order status (e.g., Completed, Processing, Pending, Cancelled).
  * A "View Details" modal provides a complete overview of a selected order, including all line items and their product images.
  * The URL is updated with search and filter parameters, making the state shareable.

## Tech Stack

* **Backend:** Node.js, Express, Mongoose, TypeScript, `node-cron`, Jest, Supertest
* **Frontend:** React, Vite, TypeScript, Tailwind CSS, Axios, React Router, Vitest
* **Database:** MongoDB (designed for MongoDB Atlas)
* **API:** WooCommerce REST API

## Setup and Installation

### Prerequisites

* Node.js (v20 or later recommended)
* npm
* A MongoDB database instance (local or on MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Prashantch265/full-stack-mern-development.git
cd full-stack-mern-development
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory
# (copy from .env.example) and fill in the variables
cp .env.example .env

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env file in the /client directory
# (copy from .env.example) and fill in the variables
cp .env.example .env

# Start the frontend development server
npm run dev
```

## Environment Variables

You must create a `.env` file in both the `server` and `client` directories. Refer to the `.env.example` files in each directory for the required variables.

### Server (`/server/.env`)
 
* `PORT`: The port for the backend server to run on (e.g., 5000).
* `NODE_ENV`: Runtime environment type of your server (e.g., production, development).
* `LOG_LEVEL`: How much information you want on your server log (e.g., info, debug).
* `MONGO_URI`: Your full MongoDB connection string.
* `WOOCOMMERCE_KEY`: The consumer key for the WooCommerce API.
* `WOOCOMMERCE_SECRET`: The consumer secret for the WooCommerce API.
* `CRON_SCHEDULE` (Optional): A cron expression to override the default sync schedule for testing.
* `CLEANUP_CRON_SCHEDULE` (Optional): A cron expression to override the default cleanup schedule for testing.

### Client (`/client/.env`)

* `VITE_API_BASE_URL`: The full base URL for the backend API (e.g., `http://localhost:5000/api`).

## API Endpoints

* `GET /api/products`: Fetches a paginated list of products.
  * Query Params: `page`, `limit`, `search`, `sortBy`, `sortOrder`
* `GET /api/orders`: Fetches a paginated list of orders.
  * Query Params: `page`, `limit`, `search`, `status`, `productId`
* `GET /api/orders/oid/:oid`: Fetches a single order by its original WooCommerce ID.

## Known Issues or Limitations

* Frontend tests were skipped due to time constraints but the testing framework (Vitest, React Testing Library) is fully configured.
