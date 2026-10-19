import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useThemeContext } from "@/context/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Features", to: "/features" },
  { label: "Pricing",  to: "/pricing" },
  { label: "Blog",     to: "/blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { resolved, setTheme } = useThemeContext();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(resolved === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            /* ── Logged-in state ── */
            <>
              <span className="text-sm text-muted-foreground hidden lg:block truncate max-w-[140px]">
                {user?.name}
              </span>
              <Button size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Dashboard
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            /* ── Guest state ── */
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((p) => !p)}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium py-2 transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="flex flex-col gap-2 pt-2 border-t">
            {isAuthenticated ? (
              <>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive/30">
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
