import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, ChevronDown, ChevronUp } from "lucide-react";
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
  authenticated?: boolean;
}

export function ShortenForm({ onSuccess, compact, authenticated = false }: ShortenFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
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
      const link = await (authenticated
        ? linksService.createAuthenticated(data)
        : linksService.create(data));
      reset();
      setIsDone(true);
      // Show "Done!" state briefly, then reveal the result card
      if (onSuccess) {
        setTimeout(() => {
          setIsDone(false);
          onSuccess(link);
        }, 700);
      } else {
        setTimeout(() => setIsDone(false), 1500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to shorten URL. Please try again.";
      const isNetworkErr =
        msg.toLowerCase().includes("cannot connect") ||
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("server");
      setApiError(
        isNetworkErr
          ? "Cannot reach the server. Make sure the backend is running."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  const shortDomain = import.meta.env.VITE_SHORT_DOMAIN ?? "lnks.to";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">

      {/* ── URL input + button — stack on all mobile, row on sm+ ── */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 min-w-0">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            {...register("originalUrl")}
            placeholder="https://your-long-url.com/paste-here"
            className="pl-9 h-12 text-sm w-full"
            aria-label="Long URL"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          loading={isLoading}
          disabled={isLoading || isDone}
          className="h-12 w-full sm:w-auto sm:px-6 shrink-0 font-semibold"
        >
          {isLoading ? "Shortening…" : isDone ? "✓ Done!" : "Shorten URL"}
        </Button>
      </div>

      {errors.originalUrl && (
        <p className="text-sm text-destructive">{errors.originalUrl.message}</p>
      )}

      {/* ── Advanced toggle ── */}
      <button
        type="button"
        onClick={() => setShowAdvanced((p) => !p)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {showAdvanced ? "Hide" : "Show"} advanced options
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 animate-fade-in">
          {/* Custom alias */}
          <div className="space-y-1.5">
            <Label htmlFor="customAlias" className="text-xs">
              Custom alias <span className="text-muted-foreground">(optional)</span>
            </Label>
            {/* flex + min-w-0 on both children prevents overflow */}
            <div className="flex min-w-0 rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="bg-muted px-2 py-2 text-xs text-muted-foreground border-r whitespace-nowrap shrink-0 max-w-[120px] truncate">
                {shortDomain}/
              </span>
              <input
                id="customAlias"
                {...register("customAlias")}
                placeholder="my-link"
                className="flex-1 min-w-0 px-2 py-2 text-sm bg-background outline-none"
                disabled={isLoading}
              />
            </div>
            {errors.customAlias && (
              <p className="text-xs text-destructive">{errors.customAlias.message}</p>
            )}
          </div>

          {/* Expiry date */}
          <div className="space-y-1.5">
            <Label htmlFor="expiresAt" className="text-xs">
              Expiry date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register("expiresAt")}
              className="text-sm w-full"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* ── Error box — never overflows, text wraps inside ── */}
      {apiError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive overflow-hidden">
          <p className="font-medium">Error</p>
          <p className="mt-0.5 break-words">{apiError}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        No registration required. Just paste and shorten.
      </p>
    </form>
  );
}
