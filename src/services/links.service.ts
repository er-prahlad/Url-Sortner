import { apiClient } from "./api";
import type {
  ShortLink,
  CreateLinkPayload,
  UpdateLinkPayload,
  LinksListParams,
  PaginatedResponse,
} from "@/types";

export const linksService = {
  async create(payload: CreateLinkPayload): Promise<ShortLink> {
    const { data } = await apiClient.post("/links", payload);
    return data.data;
  },

  async list(params?: LinksListParams): Promise<PaginatedResponse<ShortLink>> {
    const { data } = await apiClient.get("/links", { params });
    return data;
  },

  async get(id: string): Promise<ShortLink> {
    const { data } = await apiClient.get(`/links/${id}`);
    return data.data;
  },

  async update(id: string, payload: UpdateLinkPayload): Promise<ShortLink> {
    const { data } = await apiClient.patch(`/links/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/links/${id}`);
  },

  async getQR(id: string): Promise<{ qrCodeUrl: string }> {
    const { data } = await apiClient.get(`/links/${id}/qr`);
    return data.data;
  },
};
