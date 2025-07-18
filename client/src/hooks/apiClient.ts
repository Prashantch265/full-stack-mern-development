import axios, { type AxiosInstance } from "axios";

// Access the environment variable using import.meta.env
// Provide a fallback for safety, although the .env file should define it.
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * A centralized and configured Axios instance for making API requests.
 *
 * It's pre-configured with the base URL of your backend server,
 * making all API calls cleaner and easier to manage.
 */
const apiClient: AxiosInstance = axios.create({
  // The base URL for all API requests.
  // Replace with your production URL when deploying.
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
