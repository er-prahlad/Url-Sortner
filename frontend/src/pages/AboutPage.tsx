import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { Target, Users, Zap, Globe } from "lucide-react";

const VALUES = [
  { icon: Zap,    title: "Speed First",     desc: "Every millisecond counts. Our infrastructure is optimised to shorten and resolve links as fast as possible." },
  { icon: Users,  title: "User-Centric",    desc: "We design every feature around real workflows — from solo creators to enterprise marketing teams." },
  { icon: Globe,  title: "Global Reach",    desc: "Links created on LinkShortner work anywhere in the world with reliable, low-latency redirects." },
  { icon: Target, title: "Data You Trust",  desc: "Analytics you see are always real, never estimated. No fake numbers, no vanity metrics." },
];

export function AboutPage() {
  useSEO({
    title: "About Us",
    description: "Learn about LinkShortner — our mission, values, and the team building the smarter URL shortener.",
    keywords: "about linkshortner, url shortener team, link management company",
  });

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Building a smarter internet,<br />
            <span className="text-primary">one link at a time.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            LinkShortner was built because link management deserved better — faster, cleaner, and more insightful than anything that existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe every link you share is a micro-moment of trust. When someone clicks your link, they're trusting you. Our mission is to help you earn that trust — with branded, reliable, and trackable short links.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From individual creators to global marketing teams, LinkShortner gives everyone the tools that were once only available to large enterprises.
              </p>
            </div>
            <div className="animate-on-scroll animate-on-scroll-delay-2 grid grid-cols-2 gap-4">
              {["10M+", "99.9%", "150+", "24/7"].map((stat, i) => {
                const labels = ["Links Created", "Uptime SLA", "Countries", "Support"];
                return (
                  <div key={stat} className="rounded-xl border bg-card p-5 text-center hover:border-primary/40 transition-colors">
                    <p className="text-3xl font-bold text-primary">{stat}</p>
                    <p className="text-sm text-muted-foreground mt-1">{labels[i]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30 dark:bg-black/40">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 animate-on-scroll">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`rounded-xl border bg-background p-6 hover:border-primary/40 hover:shadow-md transition-all animate-on-scroll animate-on-scroll-delay-${i + 1}`}>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
