import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { Zap, Tag, QrCode, BarChart3, Clock, Shield, Globe, Layers, Lock } from "lucide-react";

const FEATURES = [
  { icon: Zap,      title: "Instant Shortening",     desc: "Generate short links in under 100ms. Our global infrastructure ensures your links are always fast." },
  { icon: Tag,      title: "Custom Aliases",          desc: "Replace random codes with branded, memorable aliases like yourname.to/launch-2026." },
  { icon: QrCode,   title: "QR Code Generator",       desc: "Download high-resolution QR codes in PNG or SVG. Customise colours and size to match your brand." },
  { icon: BarChart3,title: "Real-Time Analytics",     desc: "See every click as it happens. Track referrers, devices, browsers, and countries with precision." },
  { icon: Clock,    title: "Link Expiration",          desc: "Set links to expire automatically on a date. Perfect for campaigns, promotions, and time-sensitive content." },
  { icon: Shield,   title: "HTTPS Everywhere",         desc: "Every short link is served over HTTPS. We validate all destination URLs before creating a link." },
  { icon: Globe,    title: "Global CDN",               desc: "Redirects resolve from the nearest edge location — typically under 50ms worldwide." },
  { icon: Layers,   title: "Bulk Shortening",          desc: "Shorten up to 50 URLs in a single API call. Perfect for batch campaigns." },
  { icon: Lock,     title: "Password Protection",      desc: "Gate any link behind a password. Only people with the correct code can access the destination." },
];

export function FeaturesPage() {
  useSEO({
    title: "Features",
    description: "Explore all LinkShortner features: custom aliases, QR codes, analytics, link expiration, password protection, and more.",
    keywords: "url shortener features, custom aliases, qr code generator, link analytics, password protected links",
  });

  return (
    <PageLayout>
      <section className="py-20 md:py-24 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Every tool you need to <span className="text-primary">manage links professionally</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            From simple shortening to advanced analytics — LinkShortner has everything built in.
          </p>
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
            Start for free
          </Link>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`group rounded-xl border bg-background p-6 hover:border-primary/40 hover:shadow-md transition-all animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
