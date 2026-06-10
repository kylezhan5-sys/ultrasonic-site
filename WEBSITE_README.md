# SonoTech Ultrasonic — Website Documentation

## Overview

This is a **SEO-first B2B static website** for SonoTech Ultrasonic, built with pure HTML/CSS/JavaScript and a React shell. It is designed for international buyers searching for ultrasonic spray coating systems, transducers, and related equipment.

---

## Site Structure

```
client/public/
├── index.html                          # Homepage
├── about.html                          # About Us
├── contact.html                        # Contact & Quote Request
├── sitemap.xml                         # XML sitemap for Google
├── robots.txt                          # Search engine crawl rules
├── admin/
│   ├── index.html                      # Decap CMS admin panel
│   └── config.yml                      # CMS configuration
├── products/
│   ├── index.html                      # Products overview
│   ├── ultrasonic-spray-coating-system.html
│   ├── ultrasonic-atomizer.html
│   ├── ultrasonic-homogenizer.html
│   ├── ultrasonic-sonochemistry.html
│   ├── ultrasonic-welding-machine.html
│   ├── ultrasonic-cutting-machine.html
│   ├── ultrasonic-sewing-machine.html
│   ├── ultrasonic-transducer.html
│   ├── ultrasonic-generator.html
│   └── ultrasonic-horn.html
├── applications/
│   ├── index.html
│   ├── fuel-cell.html
│   ├── electrolyzer.html
│   ├── battery.html
│   ├── solar-cell.html
│   ├── hydrogen-production.html
│   ├── medical.html
│   ├── automotive.html
│   └── textile.html
├── case-studies/
│   ├── index.html
│   ├── fuel-cell-coating-project.html
│   ├── electrolyzer-coating-project.html
│   └── battery-dispersion-project.html
├── blog/
│   ├── index.html
│   ├── ultrasonic-spray-coating-guide.html
│   ├── fuel-cell-coating-methods.html
│   ├── ultrasonic-generator-guide.html
│   └── ultrasonic-vs-air-spray.html
├── industries/
│   └── index.html
├── resources/
│   ├── index.html
│   └── ultrasonic-application-questionnaire.html
├── downloads/
│   └── index.html
└── assets/
    ├── css/style.css                   # Main stylesheet
    └── js/
        ├── main.js                     # Main JavaScript
        └── schema.js                   # JSON-LD structured data
```

---

## Customization Guide

### 1. Update Company Information

Before publishing, update the following in **every HTML file**:

| Placeholder | Replace With |
|-------------|-------------|
| `SonoTech Ultrasonic` | Your company name |
| `sales@sonotech-ultrasonic.com` | Your real email address |
| `+86 000-0000-0000` | Your real phone/WhatsApp number |
| `https://www.sonotech-ultrasonic.com` | Your real domain |

**Quick find & replace command (run in project root):**
```bash
# Replace email
find client/public -name "*.html" -exec sed -i 's/sales@sonotech-ultrasonic.com/YOUR_EMAIL@domain.com/g' {} +

# Replace domain
find client/public -name "*.html" -exec sed -i 's/sonotech-ultrasonic.com/YOUR-DOMAIN.com/g' {} +
find client/public -name "*.xml" -exec sed -i 's/sonotech-ultrasonic.com/YOUR-DOMAIN.com/g' {} +
```

### 2. Update Product Specifications

Each product page has a specification table. Edit the HTML directly or use the Decap CMS admin panel after deployment.

### 3. Add Your Logo

Replace the text logo `ST` in the header with your actual logo:

```html
<!-- In the header, find: -->
<div class="logo-mark">ST</div>

<!-- Replace with: -->
<img src="/assets/img/logo.png" alt="Your Company Logo" width="40" height="40">
```

Upload your logo to `client/public/assets/img/logo.png`.

### 4. Update Hero Images

The hero images are hosted on a CDN. To use your own images:
1. Upload images to your hosting (Netlify, Cloudflare, etc.)
2. Replace the CDN URLs in `index.html` and product pages

---

## Deployment Options

### Option A: Manus Built-in Hosting (Recommended)

Click the **Publish** button in the Manus Management UI. Your site will be live at `xxx.manus.space`. You can also connect a custom domain in Settings → Domains.

### Option B: Netlify

1. Push this repository to GitHub
2. Connect to Netlify: https://app.netlify.com/start
3. Build settings:
   - **Build command:** `pnpm install && pnpm run build`
   - **Publish directory:** `dist/public`
4. Enable Netlify Identity for CMS access

### Option C: Vercel

1. Push to GitHub
2. Import at https://vercel.com/new
3. Framework: **Other**
4. Build command: `pnpm install && pnpm run build`
5. Output directory: `dist/public`

### Option D: GitHub Pages

1. Build locally: `pnpm install && pnpm run build`
2. Copy `dist/public/` contents to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

---

## CMS Setup (Decap CMS)

The site includes a **Decap CMS** admin panel at `/admin/`. To activate it:

1. **Deploy to Netlify** (required for Netlify Identity)
2. Enable **Netlify Identity** in your Netlify site settings
3. Enable **Git Gateway** in Identity settings
4. Invite yourself as a user
5. Access the CMS at `https://your-domain.com/admin/`

The CMS allows you to:
- Create and edit blog articles
- Add new case studies
- Update product descriptions
- Manage site settings

---

## SEO Features

This website includes comprehensive SEO optimization:

| Feature | Implementation |
|---------|---------------|
| Meta titles & descriptions | Every page has unique, keyword-optimized meta tags |
| Open Graph tags | Full OG tags for social sharing on all pages |
| Twitter Card | Summary large image cards |
| Canonical URLs | Prevents duplicate content issues |
| hreflang tags | English/Spanish/Arabic language targeting |
| JSON-LD structured data | Organization, WebSite, FAQPage, BreadcrumbList schemas |
| XML Sitemap | 37 URLs with priority and changefreq |
| Breadcrumb navigation | Visible + schema markup on all inner pages |
| Semantic HTML | Proper use of header, nav, main, article, footer |
| Image alt text | All images have descriptive alt attributes |
| Mobile-responsive | Tested at 320px, 768px, 1024px, 1440px |

---

## Target Keywords

The site is optimized for the following primary keywords:

| Keyword | Target Page |
|---------|-------------|
| ultrasonic spray coating system | /products/ultrasonic-spray-coating-system.html |
| ultrasonic spray coating fuel cell | /applications/fuel-cell.html |
| ultrasonic transducer manufacturer | /products/ultrasonic-transducer.html |
| ultrasonic homogenizer | /products/ultrasonic-homogenizer.html |
| ultrasonic welding machine | /products/ultrasonic-welding-machine.html |
| PEM fuel cell MEA coating | /applications/fuel-cell.html |
| electrolyzer electrode coating | /applications/electrolyzer.html |
| ultrasonic generator | /products/ultrasonic-generator.html |

---

## Adding New Languages

The site structure supports Spanish (`/es/`) and Arabic (`/ar/`) subdirectories. To add a language:

1. Create `client/public/es/` directory
2. Copy and translate all HTML files
3. Update hreflang tags to point to the translated versions
4. Add the language to `sitemap.xml`

---

## Contact Form

The contact form at `/contact.html` uses a `mailto:` action by default. To add a real form backend:

**Option 1: Netlify Forms** (easiest)
```html
<form class="contact-form" netlify name="contact">
```

**Option 2: Formspree**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option 3: EmailJS** (client-side, no backend needed)
Add EmailJS SDK and configure in `main.js`.

---

## Performance Notes

- All images use `loading="lazy"` for deferred loading
- CSS and JS are minified in production build
- Google Fonts are loaded with `display=swap`
- No external JavaScript dependencies (except Google Fonts and Decap CMS in admin)
- Estimated Lighthouse score: 90+ Performance, 95+ SEO, 90+ Accessibility

---

## Support

For questions about this website, contact the developer or refer to:
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
