import { apiClient } from "./api";
import type { AnalyticsOverview, LinkAnalytics } from "@/types";

export const analyticsService = {
  async overview(): Promise<AnalyticsOverview> {
    const { data } = await apiClient.get("/analytics/overview");
    const d = data.data;
    return {
      totalLinks:        d.totalLinks,
      totalClicks:       d.totalClicks,
      activeLinks:       d.activeLinks,
      avgClicksPerLink:  Math.round(d.avgClicksPerLink),
      totalLinksChange:  d.totalLinksChange  ?? 0,
      totalClicksChange: d.totalClicksChange ?? 0,
      activeLinksChange: d.activeLinksChange ?? 0,
      avgClicksChange:   d.avgClicksChange   ?? 0,
    };
  },

  async forLink(id: string): Promise<LinkAnalytics> {
    const { data } = await apiClient.get(`/links/${id}/analytics`);
    const d = data.data;
    return {
      totalClicks:      d.totalClicks,
      uniqueClicks:     d.uniqueClicks,
      clicksByDay:      d.clicksByDay      ?? [],
      clicksByCountry:  d.clicksByCountry  ?? [],
      clicksByDevice:   d.clicksByDevice   ?? [],
      clicksByBrowser:  d.clicksByBrowser  ?? [],
      clicksByReferrer: d.clicksByReferrer ?? [],
    };
  },
};
