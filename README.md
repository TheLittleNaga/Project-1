# TheLittleNaga — Expense Tracker

> A personal finance tracker built because free apps never had exactly what I needed — so I built my own.

Current version: **v3.1**

---

## Why I Built This

Most free expense apps are either too bloated, paywalled behind the features that actually matter, or don't let you own your data. This tracker is:

- **Yours** — hosted on your GitHub, your Supabase database, zero third-party middleman
- **Free, forever** — GitHub Pages + Supabase free tier, no credit card needed
- **Installable** — works as a PWA and as a native Android APK
- **Private** — no analytics, no ads, no accounts on external platforms you didn't set up yourself

---

## Features (v3.0)

| Feature | Details |
|---|---|
| 🔐 **Login + Accounts** | Email/password auth via Supabase, each user's data fully isolated |
| 👤 **Editable Profile** | Change your display name right from Settings · Name, email, and avatar visible at the top of Settings |
| 📲 **Stays Logged In** | Session persists until you sign out — no re-typing credentials |
| 🎨 **5 Dynamic Themes** | Noir, Paper, Lagoon, Sunset, Monet — saved per device, instant theme switching |
| 💱 **20 Currencies** | INR default, USD/EUR/GBP/JPY/SGD/AED and 14 more — dedicated Currency tab |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, remaining balance + live "Plenty of runway" / "Tight month" tone |
| 🗂 **Fully Customizable Categories** | Rename, recolor, add sub-categories on any built-in; create your own custom ones; themed color picker (no ugly native dialog) |
| 💳 **Smart Credit-Card Tracking** | Mark any expense as "Paid with CC" → it won't deduct from this month's balance, automatically rolls into next month's bill. Shows as red "UNPAID" until settled. |
| 🧮 **Per-charge Bill Allocator** | When paying the bill, tick exactly which purchases you're settling (e.g. pay off Travel ₹500 now, keep Books ₹200 unpaid). Supports custom-amount FIFO fill too. |
| 📅 **Split into EMIs** | Buying something big on CC? Toggle "Split into monthly EMIs", enter months + optional annual interest %, and the amount auto-spreads across future months with live preview. |
| ⏩ **Prepay remaining EMIs** | On any EMI row, one tap folds all remaining installments into today — closes out big purchases early just like card issuers allow |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars + smart notifications at 50 / 80 / 100 % |
| 🔁 **Recurring / EMI Manager** | Add recurring loans, subscriptions, rent — auto-inserted as expenses every applicable month; use 999 months for open-ended subs |
| 🔔 **Browser Notifications** | Budget alerts (50/80/100 %) + CC bill reminders ("bill is ready" / "due in 5 days") — all local, no push-service needed |
| 🔄 **Live Cloud Sync** | Realtime Supabase updates — changes on phone appear on desktop instantly; pull-to-refresh on mobile. No manual backup needed. |
| 📱 **Native Mobile Feel** | Bottom dock, FAB (home-only), custom bottom-sheet forms, view-transition animations, haptic feedback on every tap/swipe/save |
| 👆 **Swipe Navigation** | Swipe left/right in the **bottom half** of the screen to move through Home → Transactions → Analytics → Savings → Budgets → Recurring. Settings is kept separate (off the swipe ring) to prevent accidental nav. |
| 📅 **IST Time-zone Aware** | Dates always default to Asia/Kolkata "now" — matters for midnight-crossing entries |
| 🎨 **Themed Dialogs** | Prompts / confirms / color pickers all use an app-themed dialog system (no native browser dialogs) |

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
- Visit `https://<username>.github.io/<repo>/`

**Option B — Any static host:** Netlify / Vercel / your own Nginx / Caddy — zero build step.

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
In Android Studio: **Build → Generate Signed Bundle / APK**.

Android adaptive icons work automatically — the included `icon-192.png` and `icon-512.png` are tagged `maskable` in the manifest.

---

## File Structure

```
.
├── index.html          # The whole app — HTML + CSS + JS in one file
├── manifest.json       # PWA manifest (brand, icons, theme color)
├── sw.js               # Service worker (offline + cache-busting for HTML)
├── favicon.ico
├── icon.png            # Canonical 512×512 app icon (Noir theme, lime TLN)
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
- **Capacitor** — wraps the web app into APK

---

## Keyboard Shortcuts (desktop)

| Key | Action |
|---|---|
| `N` | New expense (opens bottom sheet) |
| `←` / `→` | Prev / next month |
| `Esc` | Close sheet / menu / dialog |

---

## What Changed in v3.1

- **No login-flash on launch** — boot overlay holds the screen while Supabase restores your session; app jumps straight to Home
- **Remember me** checkbox on login — saves your email to this device (never the password; use your browser/Google password manager for that). Default ON.
- **Hamburger drawer — Android-recents style** — tap the menu and your current page shrinks, tilts, and slides to the side like a recent-apps card. Tap the shrunk page *or* the X button to close.
- **Jade-green drawer palette** — the menu now uses a sleek jade/emerald tone regardless of your in-app theme, so it always feels distinct
- **Account card at top of drawer** — one tap opens Settings; dedicated Sign-out button at the bottom; Settings no longer clutters the nav list
- **Transaction search** — full-text search box on the Transactions tab filters by note, category, sub-category, amount, or date (typed or formatted)
- **Recent transactions are actually recent now** — home page sorts by date descending so you always see the latest 5 first (was previously showing the *oldest* 5 — fixed)
- **Service worker v10** — smarter cache-busting, pre-caches icons for faster cold-start, never caches HTML/manifest (avoids stale-UI bugs)
- **Manifest polish** — added `lang`, `dir`, `categories`, `id`, `display_override` for better Android/Chrome integration

## What Changed in v3.0

- **Prepay remaining EMIs** button on every split-EMI row
- **Account card** moved to top of Settings — shows avatar + editable name + email + sign-out
- **Removed Backup button** — cloud sync makes it redundant
- **Sign-out button** padding fixed on narrow mobile (no more vertical "Sign / out")
- **"Others Received" date field** no longer clips on mobile
- **New app icon** — pure Noir-black + lime italic "TLN", no white border, rounded-square mask
- **Themed color picker** everywhere (no native dialogs)
- Version bumped from v2.9 → **v3.0**

---

## Philosophy

Built for one user (me), shared because others might want the same thing:
- **No dark patterns** — no push to upgrade, no "Pro" features behind paywalls
- **No data lock-in** — change your display name, your category colors, your sub-categories — it's your data
- **No third-party analytics** — your usage is your business
- **Rewrite-friendly** — the whole thing is one `index.html` you can fork and bend to your life

---

## License

MIT — do whatever you want, just don't sell it as-is on an app store.
