import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SITE_NAME = "LinkShortner";
const DEFAULT_DESC =
  "LinkShortner — Shorten links, share smarter. Create branded short URLs, track real-time analytics, generate QR codes, and manage all your links in one place.";
const DEFAULT_KEYWORDS =
  "url shortener, link shortener, short links, qr code generator, link analytics, branded links, free url shortener, link management";

export function useSEO({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  ogImage = "/og-image.png",
  canonical,
}: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Shorten Links. Share Smarter.`;

    document.title = fullTitle;

    setMeta("description", description);
    setMeta("keywords", keywords);

    // Open Graph
    setMetaProperty("og:title", fullTitle);
    setMetaProperty("og:description", description);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:image", ogImage);
    setMetaProperty("og:site_name", SITE_NAME);

    // Twitter Card
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", fullTitle);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", ogImage);

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, keywords, ogImage, canonical]);
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}
