# Triveni HR Solution Pvt. Ltd. — website

Static HTML/CSS/JS site for **www.trivenihr.com**. No build step, no framework, no
dependencies. Every page is a plain `.html` file you can open in a browser or edit
in any text editor.

---

## 1. What's in here

```
├── index.html          Home — hero, stats, about, why-trust-us, services,
│                       job categories, destinations, process, partners, team
├── about.html          Company overview, our house, welcome message, vision,
│                       mission, values, org chart, branches, sister companies
├── services.html       Services, job categories, 9-step process, FAQ
├── clients.html        Partner logo wall
├── team.html           Leadership + overseas directors (click a card for a profile)
├── life.html           Life at Triveni HR → celebrations, the office, gallery,
│                       promotions, then Corporate Social Responsibility (#csr)
├── licence.html        Government licence and certificates
├── jobs.html           Who we hire (14 categories) + live Facebook feed + vacancies
├── notices.html        Regulations, "regulated by", state portals, notices board
├── downloads.html      Company profile & licence PDFs, demand checklist
├── nepal.html          About Nepal, for overseas employers
├── contact.html        Contact details, reception, enquiry form, map, branches
├── privacy.html        Privacy & Policy
├── terms.html          Terms & Conditions
├── 404.html            Not-found page (GitHub Pages serves this automatically)
│
├── CNAME .nojekyll robots.txt sitemap.xml .gitignore
│
└── assets/
    ├── css/style.css   All styling (one file, sectioned and commented)
    ├── js/main.js      Nav, scroll reveal, counters, marquee, bio dialogs, form
    ├── img/
    │   ├── brand/      Logo, favicon, OG image, org chart, branch map, sister logos
    │   ├── clients/    31 partner logos
    │   ├── team/       6 director portraits
    │   ├── life/       3 office / celebration photos
    │   ├── csr/        2 social-work photos
    │   ├── nepal/      Nepal photography used as background themes
    │   ├── bodies/     Department of Foreign Employment marks
    │   └── docs/       Licence, registration and PAN certificate scans
    └── downloads/      Business profile PDF, licence documents PDF
```

**Header and footer are repeated in every page** (the trade-off for having no build
step). If you change a nav link or a phone number, change it in all 16 files —
find-and-replace across the folder does it in one go.

---

## 2. Before you go live

### Connect the contact form (5 minutes)

The form on `contact.html` uses [Web3Forms](https://web3forms.com) — free, works on a
static site.

1. Go to <https://web3forms.com>, enter **info@trivenihr.com**, submit.
2. Copy the **access key** they email you.
3. In `contact.html` find `value="YOUR_WEB3FORMS_ACCESS_KEY_HERE"` and paste your key
   in place of that text.

Until you do, the form tells visitors to phone or email instead — it will not silently
fail or pretend to send.

---

## 3. Deploying to GitHub Pages

```bash
cd "trivenihr-website"
git init
git add .
git commit -m "New Triveni HR website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**

To update later:

```bash
git add . && git commit -m "What changed" && git push
```

### Pointing trivenihr.com at it

`CNAME` contains `www.trivenihr.com`. At your registrar:

| Type  | Name  | Value                     |
|-------|-------|---------------------------|
| CNAME | `www` | `YOUR-USERNAME.github.io` |
| A     | `@`   | `185.199.108.153`         |
| A     | `@`   | `185.199.109.153`         |
| A     | `@`   | `185.199.110.153`         |
| A     | `@`   | `185.199.111.153`         |

Then set `www.trivenihr.com` as the custom domain in Settings → Pages and tick
**Enforce HTTPS** once the certificate issues (up to 24 hours).

**Heads-up:** trivenihr.com currently serves a blank page. Make sure the old hosting is
switched off so it can't conflict.

---

## 4. SEO — what's already done

You already rank #1 for "Triveni HR Solution" with the title *"Triveni HR Solution |
Nepal's No 1 Recruitment Agency"*. **The homepage keeps that exact title on purpose** —
changing it would throw away the signal you've built. Don't rename it.

Built in:

- **Structured data (JSON-LD) on all 15 pages** — `EmploymentAgency` + `Organization`
  with your address, geo coordinates, phone, opening hours, founding date, licence /
  registration / PAN numbers, the 7 destination countries, and `sameAs` links to
  Facebook and both LinkedIn pages. Plus `WebPage`, `BreadcrumbList`, `ItemList` for job
  categories, `Person` for each director, and `FAQPage` on services and Nepal pages.
- **Geo meta tags** (`geo.region`, `geo.position`, `ICBM`) pointing at Samakhushi.
- Unique title, description and keywords per page; canonical URLs; Open Graph and
  Twitter cards with a branded 1200×630 image.
- `robots.txt` + `sitemap.xml` (14 URLs).
- Semantic headings, descriptive alt text on every image, clean internal linking.
- Fast: no framework, no jQuery, lazy-loaded images, one CSS and one JS file.

### What you must do off-site (this matters more than the code)

1. **Google Business Profile** — this is the single biggest lever for showing up on
   Google Maps. The website markup supports it but cannot create it. Claim/verify
   <https://business.google.com> with the exact same name, address and phone as the
   site, add photos, and collect reviews.
2. **Google Search Console** — add the property, submit `sitemap.xml`, and request
   indexing for the new pages.
3. **Bing Webmaster Tools** — same, it's quick.
4. **Consistent NAP** — Name, Address, Phone identical everywhere: Google, Facebook,
   both LinkedIn pages, sajhajobs, nepaldemand, NAFEA. Inconsistent listings are the
   most common local-SEO problem.
5. **Verify the map pin.** I used approximate coordinates (27.7372, 85.3147). Get the
   exact ones from Google Maps and update `LAT`/`LON` in the geo meta tags and JSON-LD.
6. **Post on Facebook regularly** — the Hot Jobs feed pulls from it, and the newest post
   there is from December 2024.

---

## 5. Editing the content you'll change most

### Job vacancies
Posting on your Facebook page is enough — the feed on `jobs.html` updates itself. To
pin a role, copy an `<article class="card">` block under the `FEATURED VACANCIES`
comment in `jobs.html` and edit it.

### Notices
`notices.html` has a `NOTICES BOARD` comment — copy a `<li>` block, put it at the top,
edit the date and text.

### Photos
- Office/celebration photos: `assets/img/life/` (currently 3, shown 3-across).
- Social work: `assets/img/csr/`.
- Partner logos: `assets/img/clients/` (~320×180, white background), then add a
  `<figure>` line in `clients.html` and in the marquee on `index.html`.

### Director profiles
Each director card opens a dialog. The text lives in `team.html` (and is repeated on
`index.html` and `contact.html` for the three head-office directors) inside
`<dialog class="bio" id="bio-…">`. Edit the paragraphs there.

### The WhatsApp button
The floating "Triveni HR Reception" button appears only on **contact, jobs, downloads,
licence, services and notices** — not on every page. To add it elsewhere, copy the
`<a class="wa-float" …>` block from `contact.html` into that page's `<div class="floaters">`.

### The landing-page aura
`index.html` only. Three soft brand-coloured glows (`<div class="hero__aura">`) sit
behind the hero: cyan top-right, pink bottom-left, and a faint cyan wash in the middle.
The wrapper drifts slowly on its own; `initHeroAura()` in `main.js` nudges each glow
toward the pointer by setting `--mx` / `--my` on the hero. To make the effect stronger
or weaker, change the pixel multipliers in the `.hero__orb--*` transforms in the CSS.
It is skipped on touch devices and under "reduce motion".

### Asset cache-busting
`style.css` and `main.js` are linked with `?v=2`. Browsers cache those files hard, so
**after you edit the CSS or JS, bump that number** (`?v=3`, `?v=4` …) in all 16 HTML
files — otherwise returning visitors keep the old version. Find-and-replace `?v=2`
across the folder does it in one go. Editing only HTML needs no bump.

### The "On this page" bar
Nine pages carry a sticky section nav (`<nav class="jumpnav">`, just after the page
hero): home, about, services, life, jobs, team, contact, about-Nepal and notices. Each
chip points at a `<section id="…">` on the same page, and the chip for the section you
are reading lights up as you scroll. To add or remove a chip, edit the `<li>` list and
make sure the matching `id` exists on the section.

### Where the international-employer note lives
The "International companies — recruiting from Nepal?" block appears exactly twice, by
design: on `services.html` and on `clients.html` (Partners). It used to repeat on the
home, about and contact pages — that was removed. If you move it, keep it to those two.

### State Regulatory Portals
These now live in the page body — as a full section on `services.html` and
`notices.html` (`id="portals"`) — and no longer in the footer.

---

## 6. Things I had to decide — please check these

| Item | What I used | Why / what to check |
|---|---|---|
| **Licence number** | `1174/073/074` | Your profile PDF says `174/073/074`; the licence certificate and embassy card both say `1174/073/074`. I used the official documents. |
| **Copyright year** | `© 2002–2026` | Corrected from 1998 as you asked — now consistent with "established 2002" and "23+ years". |
| **Headline figures** | 98% · 50,000+ · 12+ · 23+ | Identical wording and numbers on Home, About, Services, Jobs and Partners. Please make sure you can evidence 50,000+ placements and a 98% success rate — those are the two a client is most likely to ask about. Note "12+ sovereign countries" sits alongside "7+ preferred destinations"; I've framed them as different things (countries served vs. core markets). |
| **Dang branch** | Removed | Gone from the branch cards, the page copy, the meta descriptions — and I edited the Nepal map graphic to delete the "Dang Branch" callout and its leader line. The site now says four offices (Kathmandu, Pokhara, Butwal, Birtamode). |
| **Tulsi Paudel's profile** | Written from what you told me | LinkedIn blocks automated access (HTTP 999), so I could not read his profile. The bio covers founding in 2002, Managing Director then Chairman & Group CEO these past four years, owner, and his Rotary / education work. **His earlier career is not mentioned because I couldn't verify it** — send me the details and I'll add them. |
| **Fulcrum** | Named as a non-profit partner | Described only as "non-profit institutions such as Fulcrum". I don't know what Fulcrum does, so I deliberately didn't characterise it. Give me a sentence and I'll expand it. |
| **Job-category visuals** | Brand-gradient tiles, not photos | You asked twice for photos of each trade. I don't have any, and I won't pull unlicensed stock off the web — so the 14 categories on Hot Jobs are now full-colour gradient tiles with oversized iconography. They look strong, but they are **not photographs**. Send me pictures of your workers (engineers, chefs, welders, security, drivers, masons) and they drop straight in. |
| **Two December photos** | Not published | They looked like a private social / wedding function rather than a company event, so they're in `photos-not-used/`. Your consent note covers your people — this was about whether the photos read as company content. Say the word and I'll add them. |
| **Two government images** | Not published | `Foreign-Ministry office nepal.jpg` carries a **Setopati** news watermark and `nepal baideshek bibhak.jpeg` an **Adobe Spark** watermark. That's third-party copyright / an unlicensed export — a different issue from photo consent, and not something your consent can waive. Both are in `photos-not-used/`. The two clean DOFE marks are used on `notices.html`. |
| **Privacy & Terms** | Drafted | These are a solid starting point, not legal advice. Have your legal advisor review them before you rely on them. |
| **Overseas enquiries** | rajan@trivenihr.com | Shown on the homepage, About page and in the footer as the contact for foreign companies. |

---

## 7. Notes

- **Facebook feed:** the newest post on your page is December 2024, so the Hot Jobs feed
  will look quiet until you post again.
- **Partner logos** are now shown full colour at a larger size, as you asked.
- **Photo metadata:** all EXIF (including any GPS location) was stripped from the team,
  life and CSR photos before they went into the site.
- **Accessibility:** correct heading order, alt text on every image, keyboard-operable
  nav and profile dialogs, visible focus rings, and "reduce motion" respected.
- **Browser support:** current Chrome, Safari, Firefox, Edge and mobile.
- **Fonts** load from Google Fonts. If you'd rather self-host them (faster, no
  third-party request), that's a small change.
