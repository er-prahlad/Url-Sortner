import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const PLANS = [
  {
    name: "Starter",
    monthly: 0,
    annually: 0,
    desc: "Perfect for personal use and getting started.",
    badge: null,
    features: [
      "50 links per month",
      "Basic click analytics",
      "QR code generation",
      "Link expiration",
      "7-day data retention",
    ],
    missing: ["Custom aliases", "Bulk shortening", "API access", "Priority support"],
    cta: "Get started free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 12,
    annually: 9,
    desc: "For creators and small teams who need more power.",
    badge: "Most popular",
    features: [
      "Unlimited links",
      "Custom aliases",
      "Advanced analytics",
      "QR code customisation",
      "Bulk shortening",
      "API access",
      "90-day data retention",
      "Email support",
    ],
    missing: ["Custom domains", "Priority support"],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Business",
    monthly: 29,
    annually: 22,
    desc: "For growing teams and businesses at scale.",
    badge: null,
    features: [
      "Everything in Pro",
      "Custom domains",
      "Team workspaces",
      "SSO / SAML",
      "1-year data retention",
      "UTM campaign builder",
      "Priority support",
      "Dedicated account manager",
    ],
    missing: [],
    cta: "Contact sales",
    href: "#",
    highlight: false,
  },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                Choose a plan that works for you. Upgrade or downgrade at any time.
              </p>

              {/* Billing toggle */}
              <div className="inline-flex items-center gap-3 rounded-full border bg-muted px-2 py-1">
                <button
                  onClick={() => setAnnual(false)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    !annual ? "bg-background shadow text-foreground" : "text-muted-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    annual ? "bg-background shadow text-foreground" : "text-muted-foreground"
                  )}
                >
                  Annually
                  <span className="ml-1.5 text-xs text-green-600 font-semibold">–25%</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((plan) => {
                const price = annual ? plan.annually : plan.monthly;
                return (
                  <div
                    key={plan.name}
                    className={cn(
                      "relative rounded-2xl border p-8 flex flex-col",
                      plan.highlight
                        ? "border-primary shadow-lg shadow-primary/10 bg-primary text-primary-foreground"
                        : "bg-background"
                    )}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground shadow">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                      <p className={cn("text-sm mb-4", plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {plan.desc}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">${price}</span>
                        <span className={cn("text-sm", plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          /month
                        </span>
                      </div>
                      {annual && price > 0 && (
                        <p className={cn("text-xs mt-1", plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          Billed ${price * 12}/year
                        </p>
                      )}
                    </div>

                    <Button
                      className={cn(
                        "w-full mb-6",
                        plan.highlight
                          ? "bg-white text-primary hover:bg-white/90"
                          : ""
                      )}
                      variant={plan.highlight ? "secondary" : "default"}
                      asChild
                    >
                      <Link to={plan.href}>{plan.cta}</Link>
                    </Button>

                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className={cn("h-4 w-4 shrink-0 mt-0.5", plan.highlight ? "text-primary-foreground" : "text-primary")} />
                          {f}
                        </li>
                      ))}
                      {plan.missing.map((f) => (
                        <li key={f} className={cn("flex items-start gap-2 text-sm", plan.highlight ? "text-primary-foreground/40" : "text-muted-foreground/50")}>
                          <span className="h-4 w-4 shrink-0 mt-0.5 flex items-center justify-center">–</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
