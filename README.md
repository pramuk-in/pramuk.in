# Pramuk Marine & Dive Solutions — pramuk.in

Static website (plain HTML/CSS/JS — no build step, nothing to break) ready to deploy on
**Vercel** with the **pramuk.in** domain from **GoDaddy**.

```
website/
├── index.html        ← the whole site (hero, 6 services, about, gallery, contact form)
├── thank-you.html    ← form success page
├── 404.html          ← not-found page (Vercel picks this up automatically)
├── css/style.css
├── js/main.js        ← nav, gallery lightbox, form validation & protection
├── images/           ← logo, favicon, all operation photos
├── vercel.json       ← security headers (CSP, HSTS, etc.) + caching
├── robots.txt
└── sitemap.xml
```

---

## Step 1 — Upload to GitHub

1. Go to https://github.com/new → name the repo (e.g. `pramuk-website`) → **Private** or Public → Create.
2. Click **"uploading an existing file"** on the empty-repo page.
3. Drag in **the contents of this `website` folder** (not the folder itself).
   `index.html` and `vercel.json` must end up at the **root** of the repo.
   > Tip: GitHub's drag-and-drop keeps subfolders (`css/`, `js/`, `images/`) intact if you
   > drag them in together with the files.
4. Commit.

## Step 2 — Deploy on Vercel

1. Go to https://vercel.com → sign in (use **Continue with GitHub**).
2. **Add New… → Project** → Import the `pramuk-website` repo.
3. Framework Preset: **Other**. Leave Build Command and Output Directory **empty**.
4. Click **Deploy**. You'll get a live URL like `pramuk-website.vercel.app`.
5. Open it and check: pages load, gallery lightbox works, form validates.

## Step 3 — Connect the pramuk.in domain (GoDaddy)

1. In the Vercel project → **Settings → Domains** → add `pramuk.in`, then also add `www.pramuk.in`
   (set `www` to redirect to the apex — Vercel offers this automatically).
2. Vercel will show the DNS records it needs. Typically:
   | Type  | Name | Value                  |
   |-------|------|------------------------|
   | A     | `@`  | `76.76.21.21`          |
   | CNAME | `www`| `cname.vercel-dns.com` |
   **Use the exact values Vercel's dashboard shows you.**
3. Log in to GoDaddy → **My Products → pramuk.in → DNS**:
   - Edit the existing `A` record for `@` (or delete the "Parked" one) → point to Vercel's IP.
   - Add/edit the `CNAME` for `www` → `cname.vercel-dns.com`.
4. Wait for propagation (minutes up to ~24 h). Vercel shows a ✅ when verified and
   issues the HTTPS certificate automatically.

## Step 4 — Activate the enquiry form (one-time, IMPORTANT)

The form sends enquiries to **Admin@pramuk.in** via [FormSubmit](https://formsubmit.co) — no
server or account needed, but it must be activated once:

1. **Make sure the `Admin@pramuk.in` mailbox actually exists** (GoDaddy → Email, or your mail
   provider). If it doesn't exist yet, create it first — otherwise the activation mail goes nowhere.
2. After the site is live, fill the form once yourself and submit.
3. FormSubmit emails an **activation link** to Admin@pramuk.in → open it → click **Activate**.
4. From then on every enquiry arrives as a clean table-formatted email.
5. *Optional (recommended):* FormSubmit gives you a random alias endpoint after activation.
   In `js/main.js`, replace the `FORM_ENDPOINT` line with that alias so the email address never
   appears anywhere in the code. The comment in the file shows exactly where.

## Updating the site later

Edit the files → commit to GitHub → Vercel redeploys automatically within seconds.

---

## Security measures built in

**Transport & headers** (enforced via `vercel.json`):
- HTTPS everywhere with **HSTS** (browsers refuse plain HTTP after first visit).
- **Content-Security-Policy** — only same-origin scripts/styles/images plus Google Fonts are
  allowed to load; forms may only ever POST to `formsubmit.co`; the site cannot be iframed
  (clickjacking protection); no plugins/objects.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict `Referrer-Policy`,
  locked-down `Permissions-Policy` (no camera/mic/location access).

**Form protection** (`js/main.js` + `index.html`):
- Submissions go **directly to FormSubmit over HTTPS** — nothing is stored on the website,
  no database to breach.
- **Honeypot field** silently swallows bot submissions.
- The form's submit endpoint is **attached only after real user interaction**, so scrapers
  reading the raw HTML never see it.
- **Server-side CAPTCHA** enabled on FormSubmit (`_captcha=true`).
- Client-side validation: name, email format, mobile number (digits only, 6–15, with a
  country-code selector), enquiry length limits — plus the same rules enforced as HTML
  attributes (`required`, `maxlength`, `pattern`).
- Explicit consent checkbox before sending.

**Privacy:**
- No cookies, no trackers, no analytics, no third-party scripts.
- The contact email address is assembled by JavaScript at runtime to deter spam harvesters.
