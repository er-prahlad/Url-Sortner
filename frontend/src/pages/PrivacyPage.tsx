import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `When you create an account, we collect your name and email address. When links are clicked, we collect anonymised metadata including IP address (used for country-level geolocation only), browser type, device type, and referrer URL. We do not sell, rent, or share this data with third parties.`,
  },
  {
    title: "How We Use Your Data",
    content: `Your account data is used solely to provide and improve the LinkShortner service. Click analytics are aggregated and displayed to you in your dashboard. We use email addresses to send product updates and important account notifications — you may unsubscribe at any time.`,
  },
  {
    title: "Data Storage and Security",
    content: `All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use industry-standard security practices including bcrypt password hashing, JWT token rotation, and rate limiting. We do not store passwords in plaintext under any circumstances.`,
  },
  {
    title: "Cookies",
    content: `We use minimal cookies to maintain your session. We do not use tracking cookies or advertising cookies. You can clear cookies at any time through your browser settings without affecting core functionality.`,
  },
  {
    title: "Your Rights",
    content: `You may request a full export of your data, or permanent deletion of your account and all associated data, at any time from your account settings. We will process such requests within 30 days.`,
  },
  {
    title: "Contact",
    content: `For privacy-related questions, email us at privacy@linkshortner.com. For urgent concerns, we aim to respond within 48 hours.`,
  },
];

export function PrivacyPage() {
  useSEO({
    title: "Privacy Policy",
    description: "LinkShortner Privacy Policy — how we collect, use, and protect your data.",
    keywords: "linkshortner privacy policy, data protection, gdpr, url shortener privacy",
  });

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-b from-amber-50/40 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
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
