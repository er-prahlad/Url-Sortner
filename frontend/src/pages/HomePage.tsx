import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Tag, QrCode, BarChart3, Clock, Shield,
  ArrowRight, Link2, Share2, MousePointerClick,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSEO } from "@/hooks/useSEO";

const FEATURES = [
  { icon: Zap,      title: "Instant Shortening",    desc: "Generate a branded short link in under a second. No setup, no delays." },
  { icon: Tag,      title: "Custom Aliases",         desc: "Create memorable links with your own custom alias for better brand recall." },
  { icon: QrCode,   title: "QR Code Generation",    desc: "Download pixel-perfect QR codes in PNG or SVG format for any link." },
  { icon: BarChart3,title: "Real-Time Analytics",   desc: "Track clicks, geolocations, devices, and referrers as they happen." },
  { icon: Clock,    title: "Link Expiration",        desc: "Set automatic expiry dates so links stop working exactly when you need." },
  { icon: Shield,   title: "Secure & Reliable",     desc: "Every link is protected with HTTPS. 99.9% uptime SLA." },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Link2,            title: "Paste your long URL",        desc: "Copy any long web address and paste it into the input field." },
  { step: "02", icon: MousePointerClick,title: "Generate your short link",   desc: "Click 'Shorten URL' and get a compact, shareable link instantly." },
  { step: "03", icon: Share2,           title: "Share and track",            desc: "Share anywhere and monitor every click from your dashboard." },
];

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function HomePage() {
  useSEO({
    title: "Shorten Links. Share Smarter.",
    description: "LinkShortner — Free URL shortener with real-time analytics, custom aliases, QR codes, and link management.",
    keywords: "url shortener, free link shortener, custom short links, qr code, link analytics, linkshortner",
  });
  useScrollAnimation();

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users straight to their dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show nothing while checking auth to avoid flash
  if (isLoading || isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 to-background dark:from-black dark:to-background py-20 md:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-6 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Fast, free, and powerful URL shortener
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
              Shorten Links.{" "}
              <span className="text-primary">Share Smarter.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Create short, memorable links and track their performance in one place.
              Trusted by marketers, developers, and creators worldwide.
            </p>
          </div>

          {/* CTA card */}
          <div className="mx-auto max-w-xl w-full px-2 sm:px-0 animate-fade-in">
            <div className="rounded-2xl border bg-background shadow-lg p-6 sm:p-8 text-center space-y-5">
              <div>
                <h3 className="font-semibold text-xl mb-2">Start shortening links for free</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account in seconds — no credit card required.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="font-semibold w-full sm:w-auto">
                  <Link to="/signup">Get started free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in to your dashboard →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight mb-3">How It Works</h2>
            <p className="text-muted-foreground">Get your short link in 3 simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <div
                key={step}
                className={`flex flex-col items-center text-center group animate-on-scroll animate-on-scroll-delay-${i + 1}`}
              >
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-muted/30 dark:bg-black/40">
        <div className="container">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Powerful Features</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to create, manage, and track your short links.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`group rounded-xl border bg-background p-6 hover:shadow-md hover:border-primary/40 transition-all hover:-translate-y-0.5 animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground animate-on-scroll">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to shorten smarter?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join thousands of creators and marketers who trust LinkShortner every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-primary px-6 py-3 font-semibold hover:bg-white/90 transition-colors"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
