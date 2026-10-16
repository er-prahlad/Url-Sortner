import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Twitter, Github, Linkedin } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Pricing", to: "/pricing" },
  { label: "API", to: "#" },
];

const COMPANY_LINKS = [
  { label: "About", to: "#" },
  { label: "Blog", to: "#" },
  { label: "Careers", to: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
  { label: "Contact", to: "#" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Shorten links, share smarter. Track performance in one place.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkShort. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for developers and marketers
          </p>
        </div>
      </div>
    </footer>
  );
}
