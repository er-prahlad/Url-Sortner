import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 1. ScrollToTop — automatically scrolls window to top on every route change.
 * 2. ScrollToTopButton — floating button that appears after scrolling 300px down.
 *
 * Usage: render <ScrollToTop /> once inside <BrowserRouter> (in App.tsx).
 * The floating button is included automatically.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  // Scroll to top on every navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return <ScrollToTopButton />;
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={cn(
        // position + size
        "fixed bottom-6 right-6 z-50 h-11 w-11",
        // appearance
        "flex items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        // hover / focus
        "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // smooth show/hide
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
