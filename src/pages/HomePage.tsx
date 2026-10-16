import { useState } from "react";
import {
  Zap,
  Tag,
  QrCode,
  BarChart3,
  Clock,
  Shield,
  ArrowRight,
  Link2,
  Share2,
  MousePointerClick,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShortenForm } from "@/components/links/ShortenForm";
import { LinkResultCard } from "@/components/links/LinkResultCard";
import type { ShortLink } from "@/types";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast URL Shortening",
    desc: "Generate a short link instantly. No waiting, no delays.",
  },
  {
    icon: Tag,
    title: "Custom Aliases",
    desc: "Create branded links with your own custom alias for better recall.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    desc: "Download QR codes in PNG or SVG format for any of your links.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    desc: "Track clicks, locations, devices, and referrers in real time.",
  },
  {
    icon: Clock,
    title: "Link Expiration",
    desc: "Set expiry dates on links to control how long they stay active.",
  },
  {
    icon: Shield,
    title: "Secure Management",
    desc: "Manage and organise all your links from a single protected dashboard.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Link2,
    title: "Paste your long URL",
    desc: "Copy any long web address and paste it into the input field above.",
  },
  {
    step: "02",
    icon: MousePointerClick,
    title: "Generate your short link",
    desc: "Click 'Shorten URL' and get a compact, shareable link in seconds.",
  },
  {
    step: "03",
    icon: Share2,
    title: "Share and track your link",
    desc: "Share your short link anywhere and monitor performance from your dashboard.",
  },
];

export function HomePage() {
  const [results, setResults] = useState<ShortLink[]>([]);

  const handleSuccess = (link: ShortLink) => {
    setResults((prev) => [link, ...prev]);
  };

  const handleDismiss = (id: string) => {
    setResults((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-background dark:from-blue-950/20 dark:to-background py-20 md:py-28">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-6 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Fast, free, and simple URL shortener
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
              Shorten Links.{" "}
              <span className="text-primary">Share Smarter.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Create short, memorable links and track their performance in one place.
            </p>
          </div>

          {/* Shortener card */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border bg-background shadow-lg p-6 sm:p-8">
              <ShortenForm onSuccess={handleSuccess} />

              {/* Results */}
              {results.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {results.length} link{results.length > 1 ? "s" : ""} created
                    </p>
                    <button
                      onClick={() => setResults([])}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {results.map((link) => (
                    <LinkResultCard key={link.id} link={link} onDismiss={handleDismiss} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">How It Works</h2>
            <p className="text-muted-foreground">Get your short link in 3 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center group">
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.replace("0", "")}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Powerful Features</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to create, manage and track your short links.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border bg-background p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Create your free account and start shortening links today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-primary px-6 py-3 font-semibold hover:bg-white/90 transition-colors"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
