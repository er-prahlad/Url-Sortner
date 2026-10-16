import { useState } from "react";
import {
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  BarChart3,
  Plus,
  Link2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLinks, useDeleteLink, useUpdateLink } from "@/hooks/useLinks";
import { useClipboard } from "@/hooks/useClipboard";
import { formatDate, getStatusColor, truncateUrl } from "@/lib/utils";
import type { ShortLink, LinksListParams } from "@/types";
import { ShortenForm } from "@/components/links/ShortenForm";
import { toast } from "@/hooks/useToast";

function LinkActions({ link, onDelete }: { link: ShortLink; onDelete: (id: string) => void }) {
  const { copied, copy } = useClipboard();
  const updateLink = useUpdateLink(link.id);

  const toggleStatus = async () => {
    const next = link.status === "active" ? "disabled" : "active";
    try {
      await updateLink.mutateAsync({ status: next });
      toast({ title: `Link ${next === "active" ? "enabled" : "disabled"}`, variant: "success" });
    } catch {
      toast({ title: "Failed to update link", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copy(link.shortUrl)} title="Copy">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" asChild title="Open">
        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" title="Analytics">
        <BarChart3 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        title={link.status === "active" ? "Disable" : "Enable"}
        onClick={toggleStatus}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-destructive hover:text-destructive"
        title="Delete"
        onClick={() => onDelete(link.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function MobileLinkCard({ link, onDelete }: { link: ShortLink; onDelete: (id: string) => void }) {
  const { copied, copy } = useClipboard();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline url-truncate flex-1"
            title={link.originalUrl}
          >
            {truncateUrl(link.originalUrl, 50)}
          </a>
          <Badge className={getStatusColor(link.status)} variant="outline">
            {link.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{link.shortUrl}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{link.clicks} clicks</span>
            <span>{formatDate(link.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => copy(link.shortUrl)}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(link.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyLinksPage() {
  const [params, setParams] = useState<LinksListParams>({
    page: 1,
    limit: 10,
    sort: "newest",
    status: "all",
  });
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useLinks({ ...params, search: search || undefined });
  const deleteLink = useDeleteLink();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLink.mutateAsync(deleteId);
      toast({ title: "Link deleted", variant: "success" });
    } catch {
      toast({ title: "Failed to delete link", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const links = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Links</h1>
          <p className="text-sm text-muted-foreground">
            {pagination?.total ?? 0} link{(pagination?.total ?? 0) !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Link
        </Button>
      </div>

      {/* Backend unavailable banner */}
      {isError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 px-4 py-3 text-sm text-orange-800 dark:text-orange-300">
          Backend not connected — link management requires a live API.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by URL or alias…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={params.status as string}
          onValueChange={(v) => setParams((p) => ({ ...p, status: v as LinksListParams["status"], page: 1 }))}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={params.sort}
          onValueChange={(v) => setParams((p) => ({ ...p, sort: v as LinksListParams["sort"], page: 1 }))}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="most_clicks">Most clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {["Original URL", "Short URL", "Clicks", "Created", "Status", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 rounded bg-muted animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    <Link2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No links found.</p>
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline url-truncate block"
                        title={link.originalUrl}
                      >
                        {truncateUrl(link.originalUrl, 45)}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{link.shortUrl}</td>
                    <td className="py-3 px-4 text-sm font-medium">{link.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(link.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(link.status)} variant="outline">
                        {link.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <LinkActions link={link} onDelete={setDeleteId} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : links.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Link2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No links found.</p>
          </div>
        ) : (
          links.map((link) => <MobileLinkCard key={link.id} link={link} onDelete={setDeleteId} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {params.page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              disabled={(params.page ?? 1) <= 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={(params.page ?? 1) >= totalPages}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete link?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The short link will stop working immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={deleteLink.isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create link dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Link</DialogTitle>
          </DialogHeader>
          <ShortenForm
            onSuccess={() => {
              setCreateOpen(false);
              toast({ title: "Link created successfully!", variant: "success" });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
