# Loopzo Theme — SEO Improvement Plan

## Audit Date: 2026-03-30

---

## Issue List

### CRITICAL (3 issues)

**1. No LocalBusiness JSON-LD schema**
- Where: `layout/theme.liquid` (global head)
- Why: Google can't show a knowledge panel for Loopzo. Business name, address, phone, opening hours are all available in the contact page and footer but never marked up. Local SEO rankings suffer.

**2. No Product structured data enhancement**
- Where: `sections/main-product.liquid` (line 445-447)
- Why: There IS `{{ product | structured_data }}` which gives basic Product schema, but it's missing `AggregateRating` from the custom review system and `FAQ` schema from the tabs. Rich snippets (stars in search results, FAQ dropdowns) won't appear.

**3. No BreadcrumbList schema**
- Where: All pages with breadcrumbs (product, collection, contact)
- Why: Breadcrumbs are rendered visually but not as JSON-LD. Google can't show breadcrumb trails in search results.

---

### HIGH (5 issues)

**4. Missing Organization schema**
- Where: `layout/theme.liquid` or footer
- Why: Company info (name, KvK, social links) exists in footer but has no `Organization` schema. No `sameAs` for social profiles = Google can't connect social accounts to the brand.

**5. No custom meta descriptions for static pages**
- Where: `page.contact.liquid`, `page.about-us.liquid`
- Why: These pages rely on Shopify's default meta description (often blank or auto-generated). Google will pull random text from the page as the snippet.

**6. Review structured data missing**
- Where: `snippets/review-list.liquid`
- Why: Reviews show on product pages but have no `Review` schema markup. Individual reviews and aggregate ratings won't appear in search results. Significant CTR loss.

**7. FAQ section has no FAQPage schema**
- Where: `sections/loopzo-faq.liquid`
- Why: FAQ questions are rendered as text but no `FAQPage` JSON-LD. Google won't show expandable FAQ rich results.

**8. Heading hierarchy issues on about page**
- Where: `templates/page.about-us.liquid`
- Why: Section headings jump around without proper H1 > H2 > H3 flow. Affects content parsing and accessibility.

---

### MEDIUM (4 issues)

**9. Hero images using lazy loading**
- Where: Above-the-fold images across pages
- Why: Hero and product featured images should use `loading="eager"` + `fetchpriority="high"`. Lazy loading above-the-fold content hurts Core Web Vitals (LCP).

**10. No Open Graph image (og:image)**
- Where: `layout/theme.liquid` head
- Why: When pages are shared on social media/WhatsApp, there's no guaranteed preview image. Product pages may auto-pick one, but static pages (about, contact) will show nothing.

**11. Blog articles missing BlogPosting schema**
- Where: `sections/loopzo-blog.liquid` / article template
- Why: Blog listings show articles but no `BlogPosting` structured data. Missing opportunity for article rich results.

**12. Collection page lacks semantic heading for empty state**
- Where: `sections/loopzo-collection-redirect.liquid`
- Why: Empty collection state has headings but no semantic structure for crawlers.

---

### LOW (3 issues)

**13. No explicit robots meta tag**
- Shopify handles this automatically, but explicit `<meta name="robots" content="index, follow">` is missing for confirmation.

**14. Contact form missing accessibility descriptions**
- Aria-describedby missing on some fields — minor SEO + accessibility overlap.

**15. No hreflang tags**
- If/when multi-language is expanded, these will be needed.

---

## Implementation Plan

### Phase 1 — Structured Data (Biggest SEO impact)

| Step | What | Where | Impact |
|------|------|-------|--------|
| 1.1 | Add `LocalBusiness` JSON-LD (name, address, phone, hours, geo coords) | `layout/theme.liquid` head | Knowledge panel, local pack ranking |
| 1.2 | Add `Organization` JSON-LD with `sameAs` social links | `layout/theme.liquid` head | Brand knowledge panel |
| 1.3 | Add `BreadcrumbList` JSON-LD (dynamic based on template) | `layout/theme.liquid` | Breadcrumb rich results |
| 1.4 | Enhance product schema with `AggregateRating` from custom reviews | `sections/main-product.liquid` | Star ratings in search results |
| 1.5 | Add `Review` schema for individual reviews | `snippets/review-list.liquid` | Review rich snippets |
| 1.6 | Add `FAQPage` JSON-LD for FAQ section | `sections/loopzo-faq.liquid` | Expandable FAQ in search results |
| 1.7 | Add `BlogPosting` JSON-LD for blog articles | article template or blog section | Article rich results |

### Phase 2 — Meta & Social

| Step | What | Where | Impact |
|------|------|-------|--------|
| 2.1 | Add `og:image` fallback (logo or hero image for static pages) | `layout/theme.liquid` head | Social sharing previews |
| 2.2 | Add page-specific meta descriptions (contact, about, dealers, warranty) | Page templates | Click-through rate in SERP |
| 2.3 | Add `twitter:card` meta tag if missing | `layout/theme.liquid` head | Twitter sharing previews |

### Phase 3 — Performance & Content

| Step | What | Where | Impact |
|------|------|-------|--------|
| 3.1 | Set hero/above-fold images to `loading="eager"` | All hero sections | Core Web Vitals / LCP |
| 3.2 | Fix heading hierarchy on about page | `page.about-us.liquid` | Content structure |
| 3.3 | Add `fetchpriority="high"` on main product image | `main-product.liquid` | Core Web Vitals / LCP |

---

## Files to Modify

- `layout/theme.liquid` — LocalBusiness, Organization, BreadcrumbList JSON-LD, og:image, twitter:card
- `sections/main-product.liquid` — AggregateRating in product schema
- `snippets/review-list.liquid` — Review schema markup
- `sections/loopzo-faq.liquid` — FAQPage JSON-LD
- `sections/loopzo-blog.liquid` — BlogPosting JSON-LD
- `templates/page.contact.liquid` — Meta description
- `templates/page.about-us.liquid` — Meta description, heading hierarchy
- Hero sections (loopzo-hero, etc.) — loading="eager" on hero images

---

## Business Data for Schema

```
Company: Loopzo
Address: Zuidbaan 548H, 2841MD Moordrecht, Nederland
Phone: 0182 239 021
Email: info@loopzo.nl
KvK: 85858552
BTW: NL004158990B08
Geo: 52.015416, 4.657943
Google Maps URL: (already in contact page iframe)
```

---

## Notes

- Backup each file before modifying
- Test all JSON-LD with Google Rich Results Test after implementation
- Test og:image with Facebook Sharing Debugger and Twitter Card Validator
- Shopify auto-generates `product.structured_data` — enhance it, don't replace it
- Check `config/settings_schema.json` for social links to use in Organization `sameAs`
