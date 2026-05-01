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
| 🎨 **4 Themes** | AMOLED Black, Dark, Light, Material You — saved per device |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, remaining balance |
| 🗂 **15 Categories** | Grocery, Food, Travel, Utilities (WiFi / LPG / Electricity), Health, EMI, and more |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars |
| 🔁 **EMI Manager** | Add recurring loans — auto-inserted as expenses every applicable month |
| ☁️ **Cloud Sync** | Real-time sync across devices via Supabase Realtime |
| ⬇️ **Backup Export** | One-click JSON download of all your data |
| 📱 **Android APK** | Native app built with Capacitor — installable without Play Store |

---

## Tech Stack

```
Frontend    →  Vanilla HTML + CSS + JavaScript (no framework)
Charts      →  Chart.js 4.4
Auth        →  Supabase Auth (email + password)
Database    →  Supabase (PostgreSQL + Realtime websockets)
Hosting     →  GitHub Pages (web)
Android     →  Capacitor 6
Offline     →  Service Worker (cache-first for CDN assets)
```

No build step for the web app. No framework. Open the file and it works.

---

## Install the Android App

Download the latest APK from [Releases](../../releases) and install directly on your phone.

**On your phone:**
1. Download `app-debug.apk`
2. Tap it → Android will ask to allow unknown sources → Allow
3. Install → done

Supports Android 5.1 and above (API 22+).

---

## Web App Setup (≈ 10 minutes, completely free)

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

-- Each user can ONLY read/write their own row
CREATE POLICY "users_own_data" ON tracker
  FOR ALL
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);
```

### 3 — Enable Email Auth

Supabase → Authentication → Providers → Email → **enabled**.

For personal use — turn off **"Confirm email"** so signup is instant.

### 4 — Get your API keys

Supabase → Settings → API → copy:
- **Project URL**
- **anon/public key**

### 5 — Add keys to `index.html`

```js
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";
```

### 6 — Deploy to GitHub Pages

1. Upload `index.html`, `manifest.json`, `sw.js`
2. Settings → Pages → Deploy from `main`
3. Live at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### 7 — Enable Realtime

Supabase → Database → Replication → toggle on the `tracker` table.

### 8 — Disable Auto Pause

Supabase → Settings → General → turn off **Auto Pause**.
Free projects pause after 1 week of inactivity — this prevents that.

---

## Building the Android APK

### Requirements
- [Node.js LTS](https://nodejs.org)
- [Android Studio](https://developer.android.com/studio)
- Project folder on local drive — **never on OneDrive** (causes file corruption)

### First-time setup

```cmd
cd "C:\path\to\Project 1"
npm install
npx cap add android
npx cap sync android
npx cap open android
```

### Build APK in Android Studio

1. Wait for Gradle sync to finish (bottom progress bar)
2. Build → Generate App Bundles or APKs → Build APK(s)
3. Click "locate" in the success notification

APK location:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Every time you update `index.html`

```cmd
npx cap sync android
```

Then rebuild in Android Studio. That's it.

### Updating the app icon

1. Place a 1024×1024 PNG at `assets/icon.png`
2. Run:
```cmd
npx capacitor-assets generate --android
npx cap sync android
```

---

## How Login Works

**Sign up** — Name, email, password → account tied to a unique Supabase user ID. Data is isolated at the database level via RLS policy.

**Sign in** — Email + password → session token stored in `localStorage`.

**Stay logged in** — On every open, session is read automatically. No typing needed. Tokens auto-renew silently.

**Sign out** — Press ↩ in the sidebar. Clears the local session.

---

## Themes

Switch between 4 themes from the sidebar (desktop) or topbar (mobile):

| Theme | Style |
|---|---|
| ⚫ AMOLED | Pure black — saves battery on OLED screens |
| 🌑 Dark | Soft dark gray — easier on eyes |
| ☀️ Light | Clean white — high contrast |
| 🩵 Material You | Teal/cyan — Android M3 inspired |

Theme choice is saved per device.

---

## Supabase Free Tier — How Many Users?

| Limit | Reality for 2–3 users |
|---|---|
| 50,000 Monthly Active Users | You need 2–3 |
| 500 MB database | ~100 KB/user/month — lasts decades |
| 2 GB bandwidth/month | ~200 KB per full load |
| Credit card required | ❌ Never |

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Sync failed / red dot | Wrong Supabase URL or key |
| Login works but no data | Re-run the SQL from setup step 2 |
| APK build errors | Build → Clean Project → rebuild |
| Gradle JDK error | File → Settings → Gradle → set JDK to Embedded JDK |
| App shows blank screen | Check `androidScheme: "https"` in capacitor.config.json |
| OneDrive file errors | Move project to Desktop — never use OneDrive for this |

---

## Project Structure

```
Project 1\
├── android\              ← Android Studio project (auto-generated)
├── www\                  ← Web app files
│   ├── index.html        ← Entire app — UI, logic, auth
│   ├── manifest.json     ← PWA manifest
│   └── sw.js             ← Service worker
├── assets\
│   └── icon.png          ← Source icon (1024×1024)
├── capacitor.config.json ← Capacitor config
├── package.json
└── README.md
```

---

## Planned

- [ ] Signed release APK (for Play Store)
- [ ] Push notifications for budget alerts

---

## License

MIT — do whatever you want with it. It's your tracker.
