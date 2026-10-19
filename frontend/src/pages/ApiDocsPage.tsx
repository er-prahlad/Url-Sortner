import { PageLayout } from "@/components/layout/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { Code2, Copy, Check } from "lucide-react";
import { useState } from "react";

const BASE = "https://url-sortner-hatb.onrender.com/api/v1";

const ENDPOINTS = [
  {
    method: "POST", path: "/auth/register",
    desc: "Register a new account",
    body: `{ "name": "Alice", "email": "alice@example.com", "password": "Password1" }`,
    response: `{ "success": true, "data": { "accessToken": "eyJ...", "refreshToken": "...", "user": { ... } } }`,
  },
  {
    method: "POST", path: "/auth/login",
    desc: "Log in and receive tokens",
    body: `{ "email": "alice@example.com", "password": "Password1" }`,
    response: `{ "success": true, "data": { "accessToken": "eyJ...", "refreshToken": "..." } }`,
  },
  {
    method: "POST", path: "/links/public",
    desc: "Shorten a URL (no auth required)",
    body: `{ "originalUrl": "https://example.com", "customAlias": "my-link" }`,
    response: `{ "success": true, "data": { "id": 1, "shortUrl": "https://...", "shortCode": "my-link" } }`,
  },
  {
    method: "GET", path: "/links",
    desc: "List your links (auth required)",
    body: null,
    response: `{ "data": [...], "pagination": { "page": 1, "total": 42 } }`,
  },
  {
    method: "DELETE", path: "/links/:id",
    desc: "Delete a link (auth required)",
    body: null,
    response: `HTTP 204 No Content`,
  },
  {
    method: "GET", path: "/analytics/overview",
    desc: "Dashboard overview stats (auth required)",
    body: null,
    response: `{ "data": { "totalLinks": 24, "totalClicks": 1203, "activeLinks": 20 } }`,
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  POST:   "bg-primary/10 text-primary",
  PATCH:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
    </button>
  );
}

export function ApiDocsPage() {
  useSEO({
    title: "API Documentation",
    description: "LinkShortner REST API documentation — endpoints for link creation, analytics, and authentication.",
    keywords: "url shortener api, link shortener api, rest api documentation, short url api",
  });

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-to-b from-amber-50/60 to-background dark:from-black dark:to-background">
        <div className="container max-w-3xl text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Code2 className="h-3.5 w-3.5 text-primary" /> REST API v1
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            API <span className="text-primary">Documentation</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Integrate link shortening, QR codes, and analytics directly into your own applications.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          {/* Base URL */}
          <div className="rounded-xl border bg-muted/30 p-4 mb-10 flex items-center justify-between animate-on-scroll">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">BASE URL</p>
              <code className="text-sm font-mono text-primary">{BASE}</code>
            </div>
            <CopyButton text={BASE} />
          </div>

          {/* Auth note */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-10 animate-on-scroll">
            <p className="text-sm"><span className="font-semibold">Authentication:</span> Protected endpoints require <code className="bg-muted px-1 rounded text-xs">Authorization: Bearer &lt;accessToken&gt;</code> header. Obtain tokens via <code className="bg-muted px-1 rounded text-xs">POST /auth/login</code>.</p>
          </div>

          {/* Endpoints */}
          <div className="space-y-6">
            {ENDPOINTS.map(({ method, path, desc, body, response }, i) => (
              <div key={path + method} className={`rounded-xl border bg-background overflow-hidden animate-on-scroll animate-on-scroll-delay-${(i % 3) + 1}`}>
                <div className="flex items-center gap-3 px-5 py-4 border-b bg-muted/20">
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold font-mono ${METHOD_COLORS[method]}`}>{method}</span>
                  <code className="text-sm font-mono font-medium">{path}</code>
                  <span className="text-sm text-muted-foreground ml-auto hidden sm:block">{desc}</span>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground sm:hidden">{desc}</p>
                  {body && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-muted-foreground">REQUEST BODY</p>
                        <CopyButton text={body} />
                      </div>
                      <pre className="rounded-lg bg-muted/50 px-4 py-3 text-xs font-mono overflow-x-auto">{body}</pre>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-muted-foreground">RESPONSE</p>
                      <CopyButton text={response} />
                    </div>
                    <pre className="rounded-lg bg-muted/50 px-4 py-3 text-xs font-mono overflow-x-auto text-green-700 dark:text-green-400">{response}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
