import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const OPENINGS = [
  { title: "Senior Backend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer",        team: "Design",      location: "Remote", type: "Full-time" },
  { title: "Growth Marketing Lead",   team: "Marketing",   location: "Remote", type: "Full-time" },
  { title: "Developer Relations",     team: "Community",   location: "Remote", type: "Full-time" },
];

const BENEFITS = [
  "100% remote, async-first culture",
  "Competitive salary + equity",
  "Unlimited PTO policy",
  "Learning & development budget",
  "Top-of-the-line equipment stipend",
  "Health, dental & vision coverage",
];

export function CareersPage() {
  useSEO({
    title: "Careers",
    description: "Join the LinkShortner team. We're hiring engineers, designers, and marketers to build the future of link management.",
    keywords: "linkshortner careers, remote jobs, url shortener jobs, tech startup hiring",
  });

  return (
    <PageLayout>
      <section className="py-20 md:py-28 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Build the future of <span className="text-primary">link intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We're a small, ambitious team building tools that millions of people rely on every day. If that excites you, we'd love to talk.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30 dark:bg-black/40">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center animate-on-scroll">Why Join Us?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={b} className={`flex items-start gap-3 rounded-xl border bg-background p-4 animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}>
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-sm">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 animate-on-scroll">Open Positions</h2>
          <div className="space-y-4">
            {OPENINGS.map(({ title, team, location, type }, i) => (
              <div
                key={title}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-background p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer animate-on-scroll animate-on-scroll-delay-${i + 1}`}
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{team}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{location}</span>
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">{type}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground text-center animate-on-scroll">
            Don't see a fit? Email us at{" "}
            <a href="mailto:careers@linkshortner.com" className="text-primary hover:underline">
              careers@linkshortner.com
            </a>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
