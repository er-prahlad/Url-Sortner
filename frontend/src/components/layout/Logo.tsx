import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2 font-bold text-xl select-none", className)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Link2 className="h-4 w-4" />
      </div>
      {!iconOnly && (
        <span className="text-foreground">
          Link<span className="text-primary">Shortner</span>
        </span>
      )}
    </Link>
  );
}
