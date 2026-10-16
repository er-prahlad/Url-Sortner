import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { linksService } from "@/services/links.service";
import type { CreateLinkPayload, LinksListParams, UpdateLinkPayload } from "@/types";

export const LINKS_KEY = "links";

export function useLinks(params?: LinksListParams) {
  return useQuery({
    queryKey: [LINKS_KEY, params],
    queryFn: () => linksService.list(params),
  });
}

export function useLink(id: string) {
  return useQuery({
    queryKey: [LINKS_KEY, id],
    queryFn: () => linksService.get(id),
    enabled: !!id,
  });
}

export function useCreateLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => linksService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
  });
}

export function useUpdateLink(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLinkPayload) => linksService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
  });
}

export function useDeleteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => linksService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LINKS_KEY] }),
  });
}
