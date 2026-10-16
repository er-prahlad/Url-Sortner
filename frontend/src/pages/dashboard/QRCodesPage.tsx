import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QrCode, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeModal } from "@/components/links/QRCodeModal";
import type { ShortLink } from "@/types";

const qrFormSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type QRFormData = z.infer<typeof qrFormSchema>;

export function QRCodesPage() {
  const [previewLink, setPreviewLink] = useState<ShortLink | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<QRFormData>({
    resolver: zodResolver(qrFormSchema),
  });

  const onSubmit = (data: QRFormData) => {
    // Create a mock link object for the QR modal
    const mockLink: ShortLink = {
      id: "preview",
      originalUrl: data.url,
      shortCode: "preview",
      shortUrl: data.url,
      clicks: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPreviewLink(mockLink);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QR Codes</h1>
        <p className="text-sm text-muted-foreground">
          Generate and download QR codes for any URL.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">QR Code Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="url">URL or short link</Label>
                <Input
                  id="url"
                  placeholder="https://example.com or your short link"
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-xs text-destructive">{errors.url.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info / instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">QR Code Options</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                ["Custom colors", "Choose foreground and background colors"],
                ["Adjustable size", "128px to 512px"],
                ["PNG download", "High-quality raster image"],
                ["SVG download", "Scalable vector format"],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Download className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{title}</span>
                    <span className="text-muted-foreground"> — {desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {previewLink && (
        <QRCodeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          link={previewLink}
        />
      )}
    </div>
  );
}
