import { apiClient } from "./api";
import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from "@/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data.data;
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post("/auth/register", credentials);
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, password });
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  },
};
