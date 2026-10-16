import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: analyticsService.overview,
  });
}

export function useLinkAnalytics(id: string) {
  return useQuery({
    queryKey: ["analytics", "link", id],
    queryFn: () => analyticsService.forLink(id),
    enabled: !!id,
  });
}
