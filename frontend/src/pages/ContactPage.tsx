import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export function ContactPage() {
  useSEO({
    title: "Contact Us",
    description: "Get in touch with the LinkShortner team. We typically respond within 24 hours.",
    keywords: "contact linkshortner, url shortener support, link management help",
  });

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/v1/contact
    setSent(true);
  };

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            We'd love to <span className="text-primary">hear from you</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether it's a question, a bug report, or a feature idea — our team reads every message.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="space-y-6 animate-on-scroll">
              {[
                { icon: Mail,          title: "Email",          desc: "hello@linkshortner.com",  sub: "For general enquiries" },
                { icon: MessageSquare, title: "Support",        desc: "support@linkshortner.com", sub: "For technical issues" },
                { icon: Clock,         title: "Response Time",  desc: "Within 24 hours",          sub: "Mon–Fri, 9am–6pm IST" },
              ].map(({ icon: Icon, title, desc, sub }) => (
                <div key={title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-sm text-primary">{desc}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 animate-on-scroll animate-on-scroll-delay-2">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Message sent!</h2>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-background p-6 sm:p-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name</Label>
                      <Input id="name" placeholder="John Doe" value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" value={form.subject}
                      onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      required
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
