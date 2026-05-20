# TheLittleNaga — Expense Tracker

> A personal finance tracker built because free apps never had exactly what I needed — so I built my own.

Current version: **v3.2**

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
| 👤 **Editable Profile** | Change your display name right from Settings · Name, email, and avatar visible at the top of Settings |
| 📲 **Stays Logged In** | Session persists until you sign out — no re-typing credentials |
| 🎨 **5 Dynamic Themes** | Noir, Paper, Lagoon, Sunset, Monet — saved per device, instant theme switching |
| 💱 **20 Currencies** | INR default, USD/EUR/GBP/JPY/SGD/AED and 14 more — dedicated Currency tab |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, remaining balance + live tone indicator |
| 🗂 **Fully Customizable Categories** | Rename, recolor, add sub-categories on any built-in; create your own custom ones; themed color picker (no ugly native dialog) |
| 💳 **Smart Credit-Card Tracking** | Mark any expense as "Paid with CC" → it won't deduct from this month's balance, automatically rolls into next month's bill. Shows as red "UNPAID" until settled. |
| 🧮 **Per-charge Bill Allocator** | When paying the bill, tick exactly which purchases you're settling. Supports custom-amount FIFO fill too. |
| 📅 **Split into EMIs** | Buying something big on CC? Toggle "Split into monthly EMIs", enter months + optional annual interest %, and the amount auto-spreads across future months with live preview. |
| ⏩ **Prepay remaining EMIs** | On any EMI row, one tap folds all remaining installments into today — closes out big purchases early |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars + smart notifications at 50 / 80 / 100 % |
| 🔁 **Recurring / EMI Manager** | Add recurring loans, subscriptions, rent — auto-inserted as expenses every applicable month; use 999 months for open-ended subs |
| 🔔 **Push Notifications** | Budget alerts (50/80/100 %) + CC bill reminders — in-app banners on Android APK, real background OS push on Chrome PWA via Web Push + Supabase Edge Function |
| 🔄 **Live Cloud Sync** | Realtime Supabase updates — changes on phone appear on desktop instantly; pull-to-refresh on mobile |
| 📱 **Native Mobile Feel** | Bottom dock, FAB (home-only), custom bottom-sheet forms, view-transition animations, crisp haptic feedback |
| 👆 **Swipe Navigation** | Swipe left/right in the **bottom half** of the screen to move through Home → Transactions → Analytics → Savings → Budgets → Recurring. Settings kept off the swipe ring to prevent accidental nav. |
| 📅 **IST Time-zone Aware** | Dates always default to Asia/Kolkata "now" — matters for midnight-crossing entries |
| 🎨 **Themed Dialogs** | Prompts / confirms / color pickers all use an app-themed dialog system (no native browser dialogs) |

---

## Setup (One-time)

### 1. Create your Supabase project
- Sign up at [supabase.com](https://supabase.com) (free tier is plenty)
- Create a new project; note down the **Project URL** and **anon public key** from Settings → API

### 2. Create the database tables
In the SQL editor, paste and run:

```sql
-- Main data table
CREATE TABLE ledger_data (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ledger_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON ledger_data
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Push subscriptions (for background Web Push notifications)
CREATE TABLE push_subscriptions (
  user_id    uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  endpoint   text NOT NULL,
  p256dh     text NOT NULL,
  auth       text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sub" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### 3. Plug your keys into `index.html`
Open `index.html` and find:
```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
```
Replace with your values.

### 4. Host it
**Option A — GitHub Pages (recommended, free):**
- Push `index.html` + `manifest.json` + `sw.js` + `icons/` folder to a GitHub repo
- Settings → Pages → Deploy from branch `main` / `(root)`
- Visit `https://<username>.github.io/<repo>/`

**Option B — Any static host:** Netlify / Vercel / your own Nginx / Caddy — zero build step.

---

## Background Push Notifications (Chrome PWA)

To get real OS-level notifications even when the app is closed, follow the steps in [`PUSH_SETUP.md`](./PUSH_SETUP.md). The short version:

1. Run `npx web-push generate-vapid-keys` to get a VAPID key pair
2. Paste the public key into `index.html` → `VAPID_PUBLIC_KEY`
3. Deploy the included Edge Function: `supabase functions deploy push-alerts`
4. Create a Database Webhook in Supabase pointing at it
5. Enable notifications in the app — Settings → Notifications → Enable

**On the Android APK:** alerts fire as in-app slide-down banners while the app is open (WebViews don't support background Web Push without the `@capacitor/push-notifications` plugin).
**On Chrome PWA (installed from browser):** full background OS push notifications work out of the box with the setup above — no Firebase Console needed.

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

Android adaptive icons work automatically — `icon-192.png` and `icon-512.png` are tagged `maskable` in the manifest.

---

## File Structure

```
.
├── index.html                          # The whole app — HTML + CSS + JS in one file
├── manifest.json                       # PWA manifest (brand, icons, theme color)
├── sw.js                               # Service worker (offline caching + Web Push handler)
├── PUSH_SETUP.md                       # Step-by-step guide for background push notifications
├── favicon.ico
├── icon.png                            # Canonical 512×512 app icon
├── icons/
│   ├── icon-48.png … icon-512.png      # 12 sizes, maskable-ready
│   └── icon.svg                        # Source SVG
└── supabase/
    └── functions/
        └── push-alerts/
            └── index.ts                # Edge Function — checks thresholds, fires Web Push
```

---

## Tech Stack

- **Vanilla HTML / CSS / JS** — zero build step, zero dependencies
- **Supabase** — Postgres DB + auth + realtime + Edge Functions
- **Web Push (VAPID)** — background push notifications, no Firebase Console needed
- **Chart.js** — analytics charts
- **Lucide** — iconography
- **Capacitor** — wraps the web app into an Android APK

---

## Keyboard Shortcuts (desktop)

| Key | Action |
|---|---|
| `N` | New expense (opens bottom sheet) |
| `←` / `→` | Prev / next month |
| `Esc` | Close sheet / menu / dialog |

---

## Changelog

### v3.2
- **Background push notifications** — real OS-level alerts via Web Push + Supabase Edge Function, even when the app is closed. Works on Chrome PWA with no Firebase Console needed — just VAPID keys and one Edge Function deploy.
- **In-app alert banners on Android APK** — budget & CC bill alerts now work inside the Capacitor WebView as styled slide-down banners (no OS permission required). Previously blocked entirely.
- **Settings always scrolls to top** — switching away and back to any tab now resets the scroll position to the top every time.
- **Sign-out fixed** — now correctly returns to the login screen in all cases, including demo mode.
- **Profile card fixed** — tapping the account card in the hamburger drawer now reliably opens Settings instead of Home.
- **Hamburger nav tap delay removed** — drawer closes first, then navigates, so the transition feels instant.
- **Swipe-to-close restricted to bottom half** — the drawer can only be swiped closed from the bottom half of the screen; swiping near nav items no longer accidentally dismisses it.
- **Close button no longer overlaps account card** — repositioned with proper spacing below safe-area insets.
- **Haptic feedback crisper** — all vibration durations halved (tick: 30 → 6 ms, tap: 12 → 4 ms, etc.).
- **Service worker v11** — handles `push` and `notificationclick` events; tapping a notification opens or focuses the app.

### v3.1
- **No login-flash on launch** — boot overlay holds the screen while Supabase restores your session
- **Remember me** checkbox on login — saves your email to this device (never the password). Default ON.
- **Hamburger drawer — Android-recents style** — tap the menu and your current page shrinks, tilts, and slides to the side like a recent-apps card
- **Jade-green drawer palette** — the menu uses a sleek jade/emerald tone regardless of your in-app theme
- **Account card at top of drawer** — one tap opens Settings; dedicated Sign-out button at the bottom
- **Transaction search** — full-text search box filters by note, category, sub-category, amount, or date
- **Recent transactions are actually recent** — home page sorts by date descending (was showing oldest 5 first)
- **Service worker v10** — smarter cache-busting, pre-caches icons, never caches HTML/manifest
- **Manifest polish** — added `lang`, `dir`, `categories`, `id`, `display_override`

### v3.0
- **Prepay remaining EMIs** button on every split-EMI row
- **Account card** moved to top of Settings
- **Removed Backup button** — cloud sync makes it redundant
- **Sign-out button** padding fixed on narrow mobile
- **"Others Received" date field** no longer clips on mobile
- **New app icon** — pure Noir-black + lime italic "TLN", no white border, rounded-square mask
- **Themed color picker** everywhere (no native dialogs)

---

## Philosophy

Built for one user (me), shared because others might want the same thing:
- **No dark patterns** — no push to upgrade, no "Pro" features behind paywalls
- **No data lock-in** — your categories, your colors, your sub-categories, your data
- **No third-party analytics** — your usage is your business
- **Rewrite-friendly** — the whole thing is one `index.html` you can fork and bend to your life

---

## License

MIT — do whatever you want, just don't sell it as-is on an app store.
