# 🍬 Sweet trEat — स्वीट ट्रीट
### Premium Website · Pashan, Pune

A fully production-ready, single-page website for Sweet trEat — a women-owned Indian sweet shop, chaat centre and snack destination in Pashan, Pune, Maharashtra.

---

## 🚀 Quick Start

1. Extract the ZIP file to a folder
2. Open `index.html` in any modern browser
3. The website works immediately — no installation, no server, no dependencies required.

---

## 📁 File Structure

```
SweetTreat/
│
├── index.html      — Main HTML structure (all sections)
├── style.css       — Complete CSS3 styles (variables, animations, responsive)
├── script.js       — Vanilla JavaScript (all interactions & animations)
│
├── assets/
│   ├── images/     — (placeholder for future product photos)
│   └── icons/      — (placeholder for future custom icons)
│
└── README.md       — This file
```

---

## ✅ Features

- **10 fully styled sections**: Hero, About, Specialties, Why Us, Reviews, Gallery, Store Info, Contact, Footer
- **Sticky Navigation** with scroll effect, active link detection, mobile hamburger menu
- **Hero Section** with animated title, floating food emoji plate, stats counter animation
- **About Section** with feature grid cards
- **Specialties** — 4 animated category cards with hover effects
- **Why Us** — 8 feature cards with icons
- **Testimonial Slider** — auto-play, manual navigation, touch/swipe support, keyboard accessible
- **Gallery** — filterable grid with lightbox viewer, category filter tabs
- **Store Information** — address, hours, services, map placeholder
- **Contact Form** — with client-side validation and success feedback
- **Footer** — links, social icons, contact details
- **Back to Top** button
- **Scroll Reveal** animations via IntersectionObserver
- **Smooth Scroll** for all anchor navigation

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Maroon | `#6B1A1A` | Primary brand, nav, CTAs |
| Orange | `#D4621E` | Accents, hover, highlights |
| Gold | `#C4962A` | Decorative, ratings, tags |
| Cream | `#FDF6EE` | Page background |
| White | `#FFFFFF` | Card backgrounds |
| Charcoal | `#1C1C1C` | Body text |

**Fonts:** Cormorant Garamond (display/headings) · DM Sans (body) · Playfair Display (italic accents)

---

## 📱 Responsive Breakpoints

| Breakpoint | Width |
|---|---|
| Mobile | ≤ 480px |
| Mobile (large) | ≤ 768px |
| Tablet | ≤ 1024px |
| Desktop | > 1024px |

---

## 🏪 Business Details

| Field | Value |
|---|---|
| Business Name | Sweet trEat · स्वीट ट्रीट |
| Type | Sweet Shop · Chaat Centre · Snack Corner |
| Phone | 88057 87743 |
| Address | Sus Ln, Opp. IDBI Bank, Balaji Colony, Jai Bhavani Nagar, Pashan, Pune 411021 |
| Hours | Open Daily · 8:00 AM onwards |
| Rating | ⭐ 4.1 / 5 · 439+ Reviews |
| Ownership | Women-Owned Business |
| Services | Dine-In · No-Contact Delivery · Takeaway |

---

## 🛠 Technology

- **HTML5** — Semantic structure, ARIA accessibility
- **CSS3** — Custom properties, Grid, Flexbox, animations, transitions
- **Vanilla JavaScript** — ES6+, IntersectionObserver, touch events

No frameworks. No libraries. No build tools. No dependencies.

---

## 🔧 Customisation Guide

### Update Business Info
Edit content directly in `index.html` — all text, phone numbers, and addresses are in plain HTML.

### Change Colors
Update CSS variables at the top of `style.css` inside `:root {}`:
```css
:root {
  --maroon: #6B1A1A;
  --orange: #D4621E;
  --gold:   #C4962A;
  /* ... */
}
```

### Add Real Photos
1. Place images in `assets/images/`
2. In `index.html`, replace `<div class="gallery-inner" style="background: ...">` divs with `<img>` tags pointing to your images

### Update Google Maps
Replace the map placeholder in the Store section with an embedded iframe from Google Maps:
```html
<iframe src="YOUR_GOOGLE_MAPS_EMBED_URL"
  width="100%" height="340"
  style="border:0; border-radius:24px;"
  allowfullscreen="" loading="lazy">
</iframe>
```

---

## ♿ Accessibility

- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels on interactive elements
- Keyboard navigation for hamburger menu, gallery, slider
- Focus management
- `aria-live` regions for form feedback
- Sufficient colour contrast ratios

---

## 📄 License

© 2026 Sweet trEat. All Rights Reserved.

Website design created for Sweet trEat, Pashan, Pune.
