import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ApiError } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Attach access token from localStorage on every request ──────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Normalise error shape ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message ?? error.message ?? "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
