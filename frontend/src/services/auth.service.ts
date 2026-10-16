import { apiClient } from "./api";
import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from "@/types";

/**
 * Maps to Spring Boot AuthController at /api/v1/auth/*.
 * All responses are wrapped in { success, message, data } by the backend.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post("/auth/login", credentials);
    // Spring Boot returns: { data: { accessToken, refreshToken, user } }
    const payload = data.data;
    return {
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
      user: {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        createdAt: payload.user.createdAt,
      },
    };
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post("/auth/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });
    const payload = data.data;
    return {
      tokens: {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      },
      user: {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        createdAt: payload.user.createdAt,
      },
    };
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refresh_token");
    await apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {});
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get("/auth/me");
    const u = data.data;
    return { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt };
  },
};
