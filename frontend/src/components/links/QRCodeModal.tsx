import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ShortLink } from "@/types";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  link: ShortLink;
}

export function QRCodeModal({ open, onClose, link }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [loading, setLoading] = useState(false);

  // Regenerate QR whenever any option changes
  useEffect(() => {
    if (!open) return;

    // Small delay so the canvas DOM element exists after React re-render
    const timer = setTimeout(() => {
      if (!canvasRef.current) return;
      setLoading(true);
      QRCode.toCanvas(canvasRef.current, link.shortUrl, {
        width: size,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: "H",
      })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 50);

    return () => clearTimeout(timer);
  }, [open, link.shortUrl, size, fg, bg]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `linkshortner-qr-${link.shortCode}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const downloadSVG = async () => {
    const svgStr = await QRCode.toString(link.shortUrl, {
      type: "svg",
      color: { dark: fg, light: bg },
    });
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `linkshortner-qr-${link.shortCode}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription className="url-truncate text-xs">{link.shortUrl}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Canvas — key forces remount on size change so ref is always valid */}
          <div className="relative rounded-xl overflow-hidden border bg-white p-3">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <canvas key={`qr-${size}`} ref={canvasRef} className="block" />
          </div>

          {/* Options */}
          <div className="w-full space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Size</Label>
                <span className="text-xs font-medium text-primary">{size}px</span>
              </div>
              <input
                type="range"
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={(e) => setSize(+e.target.value)}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>128px</span>
                <span>512px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Foreground</Label>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
                  <input
                    type="color"
                    value={fg}
                    onChange={(e) => setFg(e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded border-0 p-0"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{fg}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Background</Label>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) => setBg(e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded border-0 p-0"
                  />
                  <span className="text-xs text-muted-foreground font-mono">{bg}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex gap-2 w-full">
            <Button className="flex-1" onClick={downloadPNG}>
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button variant="outline" className="flex-1" onClick={downloadSVG}>
              <Download className="h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
