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
| 🔐 **Login + Accounts** | Email/password auth, each user's data fully isolated |
| 📲 **Stays Logged In** | No re-typing credentials — session persists until you sign out |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, and remaining balance |
| 🗂 **15 Categories** | Grocery, Food, Travel, Utilities (WiFi / LPG / Electricity), Health, EMI, and more |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars |
| 🔁 **EMI Manager** | Add recurring loans — auto-inserted as expenses every applicable month |
| ☁️ **Cloud Sync** | Real-time sync across devices via Supabase Realtime |
| ⬇️ **Backup Export** | One-click JSON download of all your data |

---

## Tech Stack

```
Frontend    →  Vanilla HTML + CSS + JavaScript (no framework)
Charts      →  Chart.js 4.4
Auth        →  Supabase Auth (email + password)
Database    →  Supabase (PostgreSQL + Realtime websockets)
Hosting     →  GitHub Pages
Offline     →  Service Worker (cache-first for CDN assets)
```

No build step. No npm. Open the file and it works.

---

## Setup (≈ 10 minutes, completely free)

### 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in with GitHub
2. New project → name it `expense-tracker`, pick Mumbai region
3. Wait ~60 seconds for it to provision

### 2 — Create the database table

Supabase → SQL Editor → New Query → paste and run:

```sql
CREATE TABLE tracker (
  id TEXT PRIMARY KEY,
  data TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tracker ENABLE ROW LEVEL SECURITY;

-- Secure: each user can ONLY read/write their own row
CREATE POLICY "users_own_data" ON tracker
  FOR ALL
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);
```

> ⚠️ Upgrading from the old single-user version? Drop the old policy first:
> `DROP POLICY "allow_all" ON tracker;`

### 3 — Enable Email Auth

Supabase → Authentication → Providers → Email → **enabled**.

Optional for personal use — turn off **"Confirm email"** so you don't need to click a link every signup.

### 4 — Get your API keys

Supabase → Settings → API → copy:
- **Project URL** (e.g. `https://xyzabc.supabase.co`)
- **anon/public key** (long `eyJ...` string)

### 5 — Add your keys to `index.html`

```js
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";
```

### 6 — Deploy to GitHub Pages

1. New public repo on GitHub
2. Upload `index.html`, `manifest.json`, `sw.js`
3. Settings → Pages → Deploy from `main` → Save
4. URL: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### 7 — Enable Realtime

Supabase → Database → Replication → toggle on the `tracker` table.

### 8 — Install as an app

- **Android** (Chrome): Menu → "Add to Home screen"
- **iOS** (Safari): Share → "Add to Home Screen"
- **PC** (Chrome/Edge): install icon in the address bar

---

## How Login Works

**Sign up** — Enter name, email, password. Account created and tied to a unique user ID. Your data lives under that ID and no one else can touch it (enforced at the database level by the RLS policy).

**Sign in** — Email + password → Supabase verifies and returns a session token stored in `localStorage`.

**Staying logged in** — On every open, `supabase.auth.getSession()` reads the stored token. If it's valid, you go straight to the dashboard — no typing needed. Tokens auto-renew silently.

**Sign out** — Press ↩ at the bottom of the sidebar. Clears the local session.

---

## How Many Users on the Free Tier?

**Way more than you'll ever need for personal use.**

| Supabase Free Limit | Reality for 2–3 users |
|---|---|
| 50,000 Monthly Active Users | You need 2–3 |
| 500 MB database | ~1–2 KB per expense; 100 entries/month = ~100 KB/user. 500 MB lasts decades |
| 2 GB bandwidth/month | Full page load ≈ 200 KB. You'd need 10,000 opens to approach the limit |
| 200 concurrent Realtime connections | You have 2–3 |
| Credit card | ❌ Never required |

One thing to do once: Supabase → Settings → General → disable **Auto Pause** (free projects pause after 1 week of no activity).

---

## Planned

- [ ] **Android APK** — wrap the PWA with Capacitor
- [ ] **iOS App** — same, via TestFlight

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Red sync dot "Sync failed" | Wrong URL or key in `index.html` |
| Login works but no data loads | Re-run the SQL from Step 2 |
| "relation does not exist" | Re-run the CREATE TABLE SQL |
| Email confirmation not arriving | Turn off "Confirm email" in Supabase Auth settings |

---

## Project Structure

```
expense-tracker/
├── index.html       # Entire app — UI, logic, auth, Supabase client
├── manifest.json    # PWA manifest
├── sw.js            # Service worker
├── icon-192.png     # App icon 192×192
├── icon-512.png     # App icon 512×512
└── README.md
```

---

## License

MIT — do whatever you want with it. It's your tracker.
