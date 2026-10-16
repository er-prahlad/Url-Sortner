import { apiClient } from "./api";
import type {
  ShortLink,
  CreateLinkPayload,
  UpdateLinkPayload,
  LinksListParams,
  PaginatedResponse,
} from "@/types";

const SHORT_DOMAIN = import.meta.env.VITE_SHORT_DOMAIN ?? "localhost:8080";

/** Map a raw backend link object into the frontend ShortLink shape */
function mapLink(raw: Record<string, unknown>): ShortLink {
  return {
    id:          String(raw.id),
    originalUrl: raw.originalUrl as string,
    shortCode:   raw.shortCode as string,
    shortUrl:    raw.shortUrl as string ?? `http://${SHORT_DOMAIN}/${raw.shortCode}`,
    customAlias: raw.customAlias as string | undefined,
    title:       raw.title as string | undefined,
    clicks:      Number(raw.clicks ?? 0),
    status:      (raw.status as string ?? "active") as ShortLink["status"],
    createdAt:   raw.createdAt as string,
    updatedAt:   raw.updatedAt as string,
    expiresAt:   raw.expiresAt as string | undefined,
    password:    raw.passwordProtected as boolean | undefined,
  };
}

export const linksService = {
  async create(payload: CreateLinkPayload): Promise<ShortLink> {
    const { data } = await apiClient.post("/links", {
      originalUrl: payload.originalUrl,
      customAlias: payload.customAlias ?? undefined,
      expiresAt:   payload.expiresAt ?? undefined,
      password:    payload.password ?? undefined,
    });
    return mapLink(data.data as Record<string, unknown>);
  },

  async list(params?: LinksListParams): Promise<PaginatedResponse<ShortLink>> {
    const { data } = await apiClient.get("/links", {
      params: {
        page:   params?.page   ?? 1,
        limit:  params?.limit  ?? 10,
        search: params?.search ?? undefined,
        status: params?.status ?? "all",
        sort:   params?.sort   ?? "newest",
      },
    });
    // Backend returns { data: [...], pagination: { page, limit, total, totalPages } }
    return {
      data:       (data.data as Record<string, unknown>[]).map(mapLink),
      pagination: data.pagination,
    };
  },

  async get(id: string): Promise<ShortLink> {
    const { data } = await apiClient.get(`/links/${id}`);
    return mapLink(data.data as Record<string, unknown>);
  },

  async update(id: string, payload: UpdateLinkPayload): Promise<ShortLink> {
    const { data } = await apiClient.patch(`/links/${id}`, {
      customAlias: payload.customAlias,
      expiresAt:   payload.expiresAt,
      status:      payload.status?.toUpperCase(),
      title:       payload.title,
    });
    return mapLink(data.data as Record<string, unknown>);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/links/${id}`);
  },

  async getQR(id: string): Promise<{ qrCodeUrl: string }> {
    // Returns the URL that the frontend can use to render/download the QR
    return { qrCodeUrl: `/api/v1/links/${id}/qr?format=png` };
  },
};
