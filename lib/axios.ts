/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
// Create a custom axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) => response,
  (error: { response: { status: number; }; }) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
