import { apiClient } from "./api";
import type { AnalyticsOverview, LinkAnalytics } from "@/types";

export const analyticsService = {
  async overview(): Promise<AnalyticsOverview> {
    const { data } = await apiClient.get("/analytics/overview");
    return data.data;
  },

  async forLink(id: string): Promise<LinkAnalytics> {
    const { data } = await apiClient.get(`/links/${id}/analytics`);
    return data.data;
  },
};
