# ₹ Expense Tracker

> A personal finance tracker built because free apps never had exactly what I needed — so I built my own.

---

## Why I Built This

Most free expense apps are either too bloated, paywalled behind the features that actually matter, or don't let you own your data. This tracker is:

- **Yours** — hosted on your GitHub, your Supabase database, zero third-party middleman
- **Free, forever** — GitHub Pages + Supabase free tier, no credit card needed
- **Installable** — works as a PWA on Android and iOS, feels like a native app
- **Private** — no analytics, no ads, no accounts on external platforms you didn't set up yourself

---

## Features

| Feature | Details |
|---|---|
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, and remaining balance |
| 🗂 **15 Categories** | Grocery, Food, Travel, Utilities (WiFi / LPG / Electricity), Health, EMI, and more |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars |
| 🔁 **EMI Manager** | Add recurring loans — auto-inserted as expenses every applicable month |
| ☁️ **Cloud Sync** | Real-time sync across devices via Supabase Realtime |
| 📲 **PWA / Installable** | Add to home screen on Android (Chrome) or iOS (Safari) |
| ⬇️ **Backup Export** | One-click JSON download of all your data |

---

## Tech Stack

```
Frontend    →  Vanilla HTML + CSS + JavaScript (no framework)
Charts      →  Chart.js 4.4
Database    →  Supabase (PostgreSQL + Realtime websockets)
Hosting     →  GitHub Pages
Offline     →  Service Worker (cache-first for CDN assets)
```

No build step. No npm. Open the file and it works.

---

## Setup (≈ 10 minutes, completely free)

### 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in with GitHub
2. New project → name it `expense-tracker`, pick a region near you (Singapore / Mumbai)
3. Wait ~60 seconds for it to provision

### 2 — Create the database table

In Supabase → SQL Editor → New Query, paste and run:

```sql
CREATE TABLE tracker (
  id TEXT PRIMARY KEY,
  data TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON tracker
  FOR ALL USING (true) WITH CHECK (true);
```

### 3 — Get your API keys

Supabase → Settings → API → copy:
- **Project URL** (looks like `https://xyzabc.supabase.co`)
- **anon/public key** (long `eyJ...` string)

### 4 — Add your keys to `index.html`

Find near the top of the `<script>` block:

```js
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";
```

Replace with your actual values.

### 5 — Deploy to GitHub Pages

1. Create a new **public** repo on GitHub
2. Upload `index.html`, `manifest.json`, `sw.js`
3. Repo Settings → Pages → Deploy from `main` branch
4. Your app lives at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### 6 — Enable Realtime sync

Supabase Dashboard → Database → Replication → toggle on the `tracker` table.
This enables live push updates — change something on your phone, it appears on your PC instantly.

### 7 — Install as an app

- **Android** (Chrome): Menu → "Add to Home screen"
- **iOS** (Safari): Share → "Add to Home Screen"
- **PC** (Chrome/Edge): install icon in the address bar

---

## Planned

- [ ] **Android APK** — wrap the PWA in a native shell (Capacitor)
- [ ] **iOS App** — same approach, distribute via TestFlight
- [ ] **Multi-user / Login** — Supabase Auth so 2–3 family members each get their own data, isolated by user ID

---

## Supabase Free Tier Limits

| Resource | Limit |
|---|---|
| Database | 500 MB |
| Bandwidth | 2 GB / month |
| Realtime connections | 200 concurrent |
| Credit card required | ❌ Never |

> **Note:** Free projects pause after 1 week of inactivity. To prevent this: Supabase Dashboard → Settings → disable auto-pause.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Red sync dot / "Sync failed" | Wrong URL or key in `index.html` |
| "relation does not exist" | Re-run the SQL from Step 2 |
| Saves locally but no cross-device sync | Enable Realtime (Step 6) |
| App shows offline after deploy | Make sure the `CREATE POLICY` ran correctly |

---

## Project Structure

```
expense-tracker/
├── index.html       # Entire app — UI, logic, Supabase client
├── manifest.json    # PWA manifest (name, icons, theme)
├── sw.js            # Service worker — offline caching
├── icon-192.png     # App icon (you supply this)
├── icon-512.png     # App icon large (you supply this)
└── README.md        # This file
```

---

## License

MIT — do whatever you want with it. It's your tracker.
