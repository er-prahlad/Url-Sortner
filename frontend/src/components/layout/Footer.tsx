import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Features",  to: "/features" },
  { label: "Pricing",   to: "/pricing" },
  { label: "API Docs",  to: "/api-docs" },
];

const COMPANY_LINKS = [
  { label: "About",    to: "/about" },
  { label: "Blog",     to: "/blog" },
  { label: "Careers",  to: "/careers" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",   to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Contact",          to: "/contact" },
];

const SOCIAL = [
  { icon: Twitter,   href: "#", label: "Twitter" },
  { icon: Github,    href: "#", label: "GitHub" },
  { icon: Linkedin,  href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background dark:bg-black">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
              The smarter way to shorten, share, and scale your links — built for modern teams and creators.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkShortner. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Engineered for speed · Designed for humans · Trusted by professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
