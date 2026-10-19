import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { Calendar, Clock } from "lucide-react";

const POSTS = [
  {
    title: "Why Every Marketer Needs a URL Shortener in 2026",
    excerpt: "Long URLs hurt click-through rates, break in emails, and look unprofessional. Here's how short links fix all three.",
    category: "Marketing",
    date: "Oct 15, 2026",
    readTime: "5 min",
  },
  {
    title: "QR Codes Are Back — And This Time They're Smarter",
    excerpt: "From restaurant menus to billboard campaigns, QR codes with analytics are changing how brands measure offline engagement.",
    category: "Product",
    date: "Oct 10, 2026",
    readTime: "4 min",
  },
  {
    title: "Link Expiration: The Underrated Feature You Should Be Using",
    excerpt: "Time-limited links reduce the risk of expired promotions staying live. Here's how to use them effectively.",
    category: "Tips",
    date: "Oct 5, 2026",
    readTime: "3 min",
  },
  {
    title: "How to Build a Better UTM Strategy",
    excerpt: "UTM parameters are powerful — but only when used consistently. Learn the system top marketing teams rely on.",
    category: "Analytics",
    date: "Sep 28, 2026",
    readTime: "6 min",
  },
  {
    title: "Custom Aliases vs Random Codes: Which Should You Use?",
    excerpt: "Branded links get 39% higher click-through rates. We break down when custom aliases are worth the extra effort.",
    category: "Tips",
    date: "Sep 20, 2026",
    readTime: "4 min",
  },
  {
    title: "Introducing LinkShortner API v1",
    excerpt: "Developers can now integrate link shortening, QR generation, and analytics directly into their own apps.",
    category: "Product",
    date: "Sep 12, 2026",
    readTime: "7 min",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Product:   "bg-primary/10 text-primary",
  Tips:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Analytics: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export function BlogPage() {
  useSEO({
    title: "Blog",
    description: "LinkShortner blog — tips on URL shortening, link analytics, marketing strategy, and product updates.",
    keywords: "url shortener blog, link management tips, marketing analytics, qr code tips",
  });

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Insights, Tips & <span className="text-primary">Product Updates</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Practical advice on link management, analytics, and growth — written by the LinkShortner team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map(({ title, excerpt, category, date, readTime }, i) => (
              <article
                key={title}
                className={`group rounded-xl border bg-background p-6 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}
              >
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${CATEGORY_COLORS[category]}`}>
                  {category}
                </span>
                <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors leading-snug">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} read</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
