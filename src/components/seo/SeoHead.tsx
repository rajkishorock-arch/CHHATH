import React, { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://rajkishorock-arch.github.io/CHHATH/images/hero_sunrise.jpg',
  jsonLd = []
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper for meta tags
    const updateMeta = (nameAttr: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Update Meta Description & Open Graph
    updateMeta('name', 'description', description);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:image', ogImage);

    // Update Twitter / X Cards
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', ogImage);

    // Update Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Update Page JSON-LD Schemas (without removing Festival schema from index.html)
    const existingDynamicScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
    existingDynamicScripts.forEach((s) => s.remove());

    jsonLd.forEach((schemaData) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });
  }, [title, description, canonicalUrl, ogType, ogImage, jsonLd]);

  return null;
};
