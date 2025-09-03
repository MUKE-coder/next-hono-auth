// config/axios.ts

import axios from "axios";

// Add validation and fallback
export const API_BASE_URL = process.env.API_URL || "http://localhost:8787";

if (!process.env.API_URL && typeof window === "undefined") {
  console.warn("API_URL is not set in environment variables");
}

// Create a base axios instance without authentication
const baseApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { baseApi as api };
