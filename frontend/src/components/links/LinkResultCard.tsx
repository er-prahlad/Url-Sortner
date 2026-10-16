import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Share2,
  Calendar,
  X,
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
      await navigator.share({ url: link.shortUrl, title: "LinkShort" });
    } else {
      copy(link.shortUrl);
    }
  };

  return (
    <>
      <Card className="w-full animate-fade-in">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <Badge variant="success" className="shrink-0">
              Link created
            </Badge>
            {onDismiss && (
              <button
                onClick={() => onDismiss(link.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid gap-3">
            {/* Original URL */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Original URL</p>
              <p className="text-sm text-foreground url-truncate" title={link.originalUrl}>
                {truncateUrl(link.originalUrl, 80)}
              </p>
            </div>

            {/* Short URL */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Short URL</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 min-w-0">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline url-truncate"
                  >
                    {link.shortUrl}
                  </a>
                </div>
                <Button
                  size="sm"
                  variant={copied ? "secondary" : "default"}
                  onClick={() => copy(link.shortUrl)}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created {formatDate(link.createdAt)}
              </span>
              {link.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Expires {formatDate(link.expiresAt)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="outline" asChild>
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setQrOpen(true)}>
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} link={link} />
    </>
  );
}
