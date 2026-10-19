import { useState } from "react";
import {
  Copy, Check, ExternalLink, QrCode, Share2, Calendar, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/useClipboard";
import { formatDate, truncateUrl } from "@/lib/utils";
import type { ShortLink } from "@/types";
import { QRCodeModal } from "./QRCodeModal";

interface LinkResultCardProps {
  link: ShortLink;
  onDismiss?: (id: string) => void;
}

export function LinkResultCard({ link, onDismiss }: LinkResultCardProps) {
  const { copied, copy } = useClipboard();
  const [qrOpen, setQrOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: link.shortUrl, title: "LinkShortner" });
    } else {
      copy(link.shortUrl);
    }
  };

  return (
    <>
      {/* w-full + overflow-hidden prevents the card itself from widening */}
      <Card className="w-full overflow-hidden animate-fade-in">
        <CardContent className="p-4">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="success" className="shrink-0 text-xs">
              ✓ Link created
            </Badge>
            {onDismiss && (
              <button
                onClick={() => onDismiss(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Original URL — overflow hidden, never wraps */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">Original URL</p>
              <p
                className="text-sm text-foreground truncate"
                title={link.originalUrl}
              >
                {link.originalUrl}
              </p>
            </div>

            {/* Short URL — stacked on mobile, row on sm+ */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">Short URL</p>
              {/* Stack vertically on xs, side-by-side on sm */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* URL display box — min-w-0 prevents flex child from expanding */}
                <div className="min-w-0 flex-1 rounded-md border bg-muted/50 px-3 py-2">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline block truncate"
                    title={link.shortUrl}
                  >
                    {link.shortUrl}
                  </a>
                </div>
                {/* Copy button — full width on xs, auto on sm */}
                <Button
                  size="sm"
                  variant={copied ? "secondary" : "default"}
                  onClick={() => copy(link.shortUrl)}
                  className="w-full sm:w-auto shrink-0 h-9"
                >
                  {copied ? (
                    <><Check className="h-4 w-4 mr-1.5" />Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1.5" />Copy</>
                  )}
                </Button>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                Created {formatDate(link.createdAt)}
              </span>
              {link.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  Expires {formatDate(link.expiresAt)}
                </span>
              )}
            </div>

            {/* Action buttons — wrap safely, each button is equal width on mobile */}
            <div className="grid grid-cols-3 gap-2 pt-0.5 sm:flex sm:flex-wrap">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setQrOpen(true)}>
                <QrCode className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">QR Code</span>
              </Button>
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={handleShare}>
                <Share2 className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} link={link} />
    </>
  );
}
