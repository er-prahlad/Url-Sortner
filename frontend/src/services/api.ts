import axios, { AxiosError, type AxiosInstance } from "axios";
import type { ApiError } from "@/types";

// Points at the Spring Boot backend. Set VITE_API_BASE_URL in your .env file.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000, // 15 second timeout
});

// ── Attach access token on every request ─────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — normalise errors ───────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // ── Network / CORS / server-down error ───────────────────────────────────
    if (!error.response) {
      const isTimeout = error.code === "ECONNABORTED";
      const msg = isTimeout
        ? "Request timed out. The server may be down."
        : "Cannot connect to the server. Make sure the backend is running and VITE_API_BASE_URL is set correctly in your .env file.";
      return Promise.reject(new Error(msg));
    }

    // ── Silent token refresh on 401 ──────────────────────────────────────────
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/login"
    ) {
      const storedRefresh = localStorage.getItem("refresh_token");
      if (storedRefresh) {
        if (isRefreshing) {
          return new Promise<string>((resolve) => refreshQueue.push(resolve)).then(
            (newToken) => {
              originalRequest.headers!.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          );
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken: storedRefresh,
          });
          const newAccess: string = data.data.accessToken;
          const newRefresh: string = data.data.refreshToken;

          localStorage.setItem("access_token", newAccess);
          localStorage.setItem("refresh_token", newRefresh);

          refreshQueue.forEach((cb) => cb(newAccess));
          refreshQueue = [];

          originalRequest.headers!.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(new Error("Session expired. Please sign in again."));
        } finally {
          isRefreshing = false;
        }
      }
    }

    // ── Extract server error message ─────────────────────────────────────────
    const message =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
