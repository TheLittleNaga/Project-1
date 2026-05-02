# TheLittleNaga — Expense Tracker

> A personal finance tracker built because free apps never had exactly what I needed — so I built my own.

---

## Why I Built This

Most free expense apps are either too bloated, paywalled behind the features that actually matter, or don't let you own your data. This tracker is:

- **Yours** — hosted on your GitHub, your Supabase database, zero third-party middleman
- **Free, forever** — GitHub Pages + Supabase free tier, no credit card needed
- **Installable** — works as a PWA and as a native Android APK
- **Private** — no analytics, no ads, no accounts on external platforms you didn't set up yourself

---

## Features

| Feature | Details |
|---|---|
| 🔐 **Login + Accounts** | Email/password auth via Supabase, each user's data fully isolated |
| 📲 **Stays Logged In** | Session persists until you sign out — no re-typing credentials |
| 🎨 **5 Dynamic Themes** | Noir, Light, Forest, Ocean, Sepia — saved per device, instant theme switching |
| 💱 **20 Currencies** | INR default, USD/EUR/GBP/JPY/SGD/AED and 14 more — dedicated Currency tab |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, remaining balance + live "Plenty of runway" / "Tight month" tone |
| 🗂 **Fully Customizable Categories** | Rename, recolor, add sub-categories on any built-in; create your own custom ones; themed color picker (no ugly native dialog) |
| 💳 **Smart Credit-Card Tracking** | **Mark any expense as "Paid with CC" →** it won't deduct from this month's balance, automatically rolls into next month's bill. Shows as red "UNPAID" until settled. |
| 🧮 **Per-charge Bill Allocator** | When paying the bill, tick exactly which purchases you're settling (e.g. pay off Travel ₹500 now, keep Books ₹200 unpaid). Supports custom-amount FIFO fill too. |
| 📅 **Split into EMIs** | Buying something big on CC? Toggle "Split into monthly EMIs", enter months + optional annual interest %, and the amount auto-spreads across future months with live preview. |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars + smart notifications at 50% / 80% / 100% |
| 🔁 **Recurring / EMI Manager** | Add recurring loans, subscriptions, rent — auto-inserted as expenses every applicable month; use 999 months for open-ended subs |
| 🔔 **Browser Notifications** | Budget alerts (50/80/100 %) + CC bill reminders ("bill is ready" / "due in 5 days") — all local, no push-service needed |
| 🔄 **Live Sync** | Realtime Supabase updates — changes on phone appear on desktop instantly; pull-to-refresh on mobile |
| 📱 **Native Mobile Feel** | Bottom dock, FAB (home-only), custom bottom-sheet forms, view-transition animations, haptic feedback on every tap/swipe/save |
| 👆 **Swipe Navigation** | Swipe left/right in the bottom half of the screen to move through Home → Transactions → Analytics → Savings → Budgets → Recurring. Settings is kept separate (off the swipe ring) to prevent accidental nav. |
| 📅 **IST Time-zone Aware** | Dates always default to Asia/Kolkata "now" — matters for midnight-crossing entries |

---

## Setup (One-time)

### 1. Create your Supabase project
- Sign up at [supabase.com](https://supabase.com) (free tier is plenty)
- Create a new project; note down the **Project URL** and **anon public key** from Settings → API

### 2. Create the `ledger_data` table
In the SQL editor, paste and run:
```sql
CREATE TABLE ledger_data (
  user_id uuid primary key references auth.users on delete cascade,
  payload jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Enable Row Level Security so users only see their own data
ALTER TABLE ledger_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON ledger_data
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### 3. Plug your keys into `index.html`
Open `index.html` and find:
```js
const SUPABASE_URL='YOUR_SUPABASE_URL';
const SUPABASE_KEY='YOUR_ANON_KEY';
```
Replace with your values.

### 4. Host it
**Option A — GitHub Pages (recommended, free):**
- Push `index.html` + `manifest.json` + `sw.js` + `icons/` folder to a GitHub repo
- Settings → Pages → Deploy from branch `main` / `(root)`
- Visit `https://<username>.github.io/<repo>/` — done

**Option B — Any static host:**
Drop the files on Netlify / Vercel / your own Nginx / Caddy — nothing to build.

---

## Build the Android APK (Capacitor)

```bash
# Prerequisites: Node.js + Android Studio
npm install -g @capacitor/cli
npx cap init TheLittleNaga com.you.thelittlenaga --web-dir=.
npx cap add android
npx cap sync
npx cap open android
```
In Android Studio: Build → Generate Signed Bundle / APK.

---

## File Structure

```
.
├── index.html          # The whole app — HTML + CSS + JS in one file
├── manifest.json       # PWA manifest (brand, icons, theme color)
├── sw.js               # Service worker (offline + cache-busting for HTML)
├── favicon.ico
├── icon.png            # Canonical 512×512 app icon
└── icons/
    ├── icon-48.png … icon-512.png  (12 sizes, maskable-ready)
    └── icon.svg        # Source SVG
```

---

## Tech Stack

- **Vanilla HTML / CSS / JS** — zero build step, zero dependencies
- **Supabase** — Postgres DB + auth + realtime
- **Chart.js** — analytics charts
- **Lucide** — iconography
- **Capacitor** — to wrap into APK

---

## Keyboard Shortcuts (desktop)

| Key | Action |
|---|---|
| `N` | New expense (opens bottom sheet) |
| `←` / `→` | Prev / next month |
| `Esc` | Close sheet / menu / dialog |

---

## Philosophy

Built for one user (me), shared because others might want the same thing:
- **No dark patterns** — no push to upgrade, no "Pro" features behind paywalls
- **No data lock-in** — JSON backup export one click away
- **No third-party analytics** — your usage is your business
- **Rewrite-friendly** — the whole thing is one `index.html` you can fork and bend to your life

---

## License

MIT — do whatever you want, just don't sell it as-is on an app store.
