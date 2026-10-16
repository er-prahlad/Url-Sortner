import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLinkSchema, type CreateLinkFormData } from "@/lib/schemas";
import type { ShortLink } from "@/types";
import { linksService } from "@/services/links.service";
import { cn } from "@/lib/utils";

interface ShortenFormProps {
  onSuccess?: (link: ShortLink) => void;
  compact?: boolean;
}

export function ShortenForm({ onSuccess, compact }: ShortenFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const link = await linksService.create(data);
      onSuccess?.(link);
      reset();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      {/* Main input row */}
      <div className={cn("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            {...register("originalUrl")}
            placeholder="https://your-long-url.com/paste-it-here"
            className="pl-9 h-12 text-sm"
            aria-label="Long URL"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          loading={isLoading}
          className="h-12 px-6 shrink-0 font-semibold"
        >
          {isLoading ? "Shortening…" : "Shorten URL"}
        </Button>
      </div>

      {errors.originalUrl && (
        <p className="text-sm text-destructive">{errors.originalUrl.message}</p>
      )}

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((p) => !p)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showAdvanced ? "Hide" : "Show"} advanced options
      </button>

      {showAdvanced && (
        <div className="grid sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
          <div className="space-y-1.5">
            <Label htmlFor="customAlias" className="text-xs">
              Custom alias <span className="text-muted-foreground">(optional)</span>
            </Label>
            <div className="flex items-center rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="bg-muted px-3 py-2 text-xs text-muted-foreground border-r whitespace-nowrap">
                {import.meta.env.VITE_SHORT_DOMAIN ?? "lnks.to"}/
              </span>
              <input
                id="customAlias"
                {...register("customAlias")}
                placeholder="my-link"
                className="flex-1 px-3 py-2 text-sm bg-background outline-none min-w-0"
                disabled={isLoading}
              />
            </div>
            {errors.customAlias && (
              <p className="text-xs text-destructive">{errors.customAlias.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiresAt" className="text-xs">
              Expiry date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register("expiresAt")}
              className="text-sm"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {apiError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {apiError}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        No registration required. Just paste and shorten.
      </p>
    </form>
  );
}
