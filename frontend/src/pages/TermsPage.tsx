import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using LinkShortner, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.",
  },
  {
    title: "2. Acceptable Use",
    content: "You may not use LinkShortner to shorten links to illegal content, malware, phishing sites, or any content that violates applicable laws. We reserve the right to remove any link and suspend any account that violates these terms without prior notice.",
  },
  {
    title: "3. Account Responsibility",
    content: "You are responsible for all activity that occurs under your account. You must maintain the security of your credentials and notify us immediately of any unauthorised access.",
  },
  {
    title: "4. Intellectual Property",
    content: "The LinkShortner platform, including its design, code, and content, is owned by LinkShortner and protected by applicable intellectual property laws. You retain ownership of any content you create through the service.",
  },
  {
    title: "5. Service Availability",
    content: "We strive for 99.9% uptime but cannot guarantee uninterrupted access. We may modify or discontinue features with reasonable notice. We are not liable for damages resulting from service interruptions.",
  },
  {
    title: "6. Limitation of Liability",
    content: "LinkShortner is provided 'as is' without warranties of any kind. Our liability is limited to the amount paid for the service in the past 12 months, or $100, whichever is greater.",
  },
  {
    title: "7. Changes to Terms",
    content: "We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes by email.",
  },
  {
    title: "8. Contact",
    content: "For questions about these terms, contact us at legal@linkshortner.com.",
  },
];

export function TermsPage() {
  useSEO({
    title: "Terms of Service",
    description: "LinkShortner Terms of Service — the rules and guidelines for using our URL shortening platform.",
    keywords: "linkshortner terms of service, url shortener terms, link management terms",
  });

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-b from-amber-50/40 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: October 2026</p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container max-w-3xl space-y-10">
          {SECTIONS.map(({ title, content }, i) => (
            <div key={title} className={`animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}>
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <p className="text-muted-foreground leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
