# TheLittleNaga — Expense Tracker

> A personal finance tracker built because free apps never had exactly what I needed — so I built my own.

Current version: **v4.1**

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
| 🔑 **Forgot / Change Password** | Forgot password → email OTP code + set a new one, no link-click needed. Signed in? Change it from Settings with your current password. |
| 👤 **Editable Profile** | Change your display name right from Settings · Name, email, and avatar visible at the top of Settings |
| 📲 **Stays Logged In** | Session persists until you sign out — no re-typing credentials |
| 🎨 **5 Dynamic Themes** | Noir, Paper, Lagoon, Sunset, Monet — saved per device, instant theme switching |
| 💱 **20 Currencies** | INR default, USD/EUR/GBP/JPY/SGD/AED and 14 more — dedicated Currency tab |
| 📊 **Dashboard** | Monthly overview with salary, carryover, other income, remaining balance + live tone indicator |
| 🗂 **Fully Customizable Categories** | Rename, recolor, add sub-categories on any built-in; create your own custom ones; themed color picker (no ugly native dialog) |
| 💳 **Smart Credit-Card Tracking** | Mark any expense as "Paid with CC" → it won't deduct from this month's balance, automatically rolls into next month's bill. Shows as red "UNPAID" until settled. |
| 🧮 **Per-charge Bill Allocator** | When paying the bill, tick exactly which purchases you're settling. Supports custom-amount FIFO fill too. Each payment is recorded **one line per category** (Food, Travel, Utilities → WiFi…), so your analytics keep the original categories. |
| 📅 **Split into EMIs** | Buying something big on CC? Toggle "Split into monthly EMIs", enter months + optional annual interest %, and the amount auto-spreads across future months with live preview. Banks that bill unevenly? Type the **exact amounts** (`4000, 4000, 2000`) or set an **advance** paid now plus equal EMIs. Rounding paise always land on the last installment, so the total is exact. |
| ⏩ **Prepay remaining EMIs** | On any EMI row, one tap folds all remaining installments into today — closes out big purchases early |
| 📈 **Analytics** | Daily / Weekly / Monthly / Yearly stacked bar charts |
| 💰 **Savings Tracker** | Auto carry-forward balance, 12-month income vs expense comparison |
| 🎯 **Budgets** | Set per-category monthly limits with live progress bars + smart notifications at 50 / 80 / 100 % |
| 📥 **Import statements** | Upload a bank or credit-card statement (CSV / Excel) — or the built-in template — and months of transactions land in one go. Salary credits set your salary, people paying you become income, card-bill payments settle the right bill, repeating EMIs become Recurring entries, duplicates are skipped, and one tap undoes the whole import. See [Importing transactions](#importing-transactions). |
| 🔁 **Recurring / EMI Manager** | Add recurring loans, subscriptions, rent — auto-inserted as expenses every applicable month; use 999 months for open-ended subs |
| 🧾 **Template inside the app** | Settings → Import statement → Excel / CSV template (built from *your* categories), **Copy CSV** for Google Sheets, or **Paste rows** straight into the app — nothing to hunt for. |
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
-- Main data table (the app stores one JSON document per user)
CREATE TABLE tracker (
  id         uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  data       text NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON tracker
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Live sync across devices
ALTER PUBLICATION supabase_realtime ADD TABLE tracker;

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

### 3. Enable OTP-style password reset emails
By default, Supabase's "Reset Password" email template only contains a clickable link. For the in-app code flow to work:
- Go to **Authentication → Email Templates → Reset Password** in your Supabase dashboard
- Make sure the template body includes `{{ .Token }}` somewhere (e.g. "Your code is: {{ .Token }}") — that's the code the app expects the user to type in. You can keep the link too if you want, it just won't be needed.
- Under **Authentication → Sign In / Providers → Email**, "Email OTP length" controls how many digits that code is (default 6) — the app accepts anywhere from 6–8 digits, so this is safe to change.

Two more toggles in that same Email settings panel affect the **Settings → Change password** flow specifically (not forgot-password): **"Secure password change"** (requires a recent sign-in, handled automatically) and **"Require current password when updating"** (the app already sends your current password along with the update, so this is safe to leave on).

### 4. Plug your keys into `index.html`
Open `index.html` and find:
```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
```
Replace with your values. (The anon key is *meant* to be public — what protects your data is the row-level-security policy above, so make sure `ENABLE ROW LEVEL SECURITY` ran on both tables.)

### 5. Host it
**Option A — GitHub Pages (recommended, free):**
- Push `index.html` + `manifest.json` + `sw.js` + `icons/` folder to a GitHub repo
- Settings → Pages → Deploy from branch `main` / `(root)`
- Visit `https://<username>.github.io/<repo>/`

**Option B — Any static host:** Netlify / Vercel / your own Nginx / Caddy — zero build step.

---

## Importing transactions

**Settings → Import statement** (or the **Import** button on the Transactions tab). Pick a file, review everything, press **Import**. Nothing is saved until you do, the file is read on your device and never uploaded, and **Settings → Undo last import** reverses a whole batch.

**What you can import**
- Your bank's **CSV / XLS / XLSX** statement download (columns are detected automatically; if not, you map them).
- A **credit-card statement** (tick the "credit-card statement" box — purchases come in as *Paid with CC*).
- The **template** (Excel, CSV, or *Paste rows*) for full control — it matches the Add form. Get it from the same screen; it's pre-filled with your own categories.
- PDF statements are **not** supported — download CSV/Excel from net banking instead.

**How each row is understood (bank statements)**

| In the statement | What happens |
|---|---|
| Salary credit | Sets that month's salary (skipped if one is already set, unless you choose to replace it) |
| Other credits (people paying you, refunds, interest) | Imported as *Other income* with the payer's name |
| Credit-card bill payment | Settles the matching card bill — one payment line per category — and is matched to the right bill (respects your cut-off day and partial payments) |
| Repeating monthly debit (EMIs, rent, subscriptions) | Offered as one **Recurring** entry instead of many separate rows |
| Everything else | Expense, categorised from your own history first, then keyword rules |
| Already in your tracker (same amount, ±1 day) | Detected and skipped, so overlapping dates are safe |

**Template types:** `Expense` · `Income` · `Salary` · `CC Bill Payment` · `Recurring`. Card EMIs: *Paid with CC* + `Months`, or exact bank amounts in `Custom installment amounts` (`4000, 4000, 2000`; for an advance list every payment — the first is paid on the purchase date).

**Card flow:** import the card statement first, then the bank statement — each card payment is matched to the bill it settles. Don't enter the same spend twice (card purchases *and* plain expenses).

Ready-made copies live in [`templates/`](./templates).

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

**After every update to `index.html`:** run `npx cap sync` and rebuild in Android Studio (unless your Capacitor config loads your hosted URL via `server.url`, in which case a deploy is enough).

**Optional — save the import template as a file on the phone:** *Copy CSV* and *Paste rows* work out of the box. To make the *Excel template / CSV template* buttons open Android's Save/Share sheet, add two plugins and rebuild:
```bash
npm install @capacitor/filesystem @capacitor/share
npx cap sync
```
Importing itself needs no plugins — the file picker is the WebView's built-in one. Excel (`.xlsx`) import loads its reader library from the internet the first time you use it; CSV works fully offline.

---

## File Structure

```
.
├── index.html                          # The whole app — HTML + CSS + JS in one file
├── manifest.json                       # PWA manifest (brand, icons, theme color)
├── sw.js                               # Service worker (offline caching + Web Push handler)
├── FEATURES.md                         # Plain-language walkthrough of every feature
├── PUSH_SETUP.md                       # Step-by-step guide for background push notifications
├── templates/
│   ├── expense-import-template.xlsx    # Import template (Entries · Examples · Categories · Guide)
│   └── expense-import-template.csv     # Same columns, plain CSV
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
- **SheetJS** — reads Excel statements (loaded on demand, only when you import an `.xlsx`)
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

### v4.1
- **Import statements & templates (new).** Bring in months of transactions from a bank/credit-card CSV or Excel statement, or from the built-in template. Review screen with per-row category / type / note, month grouping, filters (All · To import · Skipped · Duplicates), merchant-based category learning, duplicate detection against what you already have, and a one-tap **Undo last import**.
- **Statements understood the way the app works.** Salary credits → monthly salary. Other credits → Other income with the payer's name. Card-bill payments → settle the right bill. Repeating monthly debits → optional **Recurring** entries (EMIs auto-suggested). Credit-card statements import as *Paid with CC*.
- **Card bill payments are recorded per category.** Paying a bill (allocator or custom amount) now creates one line per original category (and sub-category) instead of a single Miscellaneous line. Settings has a one-time **Split past card payments by category** tool for older payments.
- **Settled card purchases are no longer counted twice.** Previously a purchase counted in the month you bought it *and* again when you paid the bill. Purchases covered by a payment are now tagged **BILLED** and left out of totals; the per-category payment lines carry the amount in the month you paid. Applies to Home, carry-forward, charts, budgets, savings and category drill-downs.
- **Uneven / advance card EMIs.** Exact installment amounts (e.g. 4000 + 4000 + 2000) or an advance + equal EMIs, in both the Add form and the importer; equal splits now add up to the exact total (leftover paise on the last installment).
- **Template built into the app.** Excel / CSV template from your own categories, *Copy CSV* for Google Sheets, and *Paste rows* — no file to lose. Optional Capacitor Filesystem + Share plugins enable saving it as a file on Android.
- **Date fix (India).** Installment dates were one day early and "today" was wrong between midnight and ~5:30 am, because dates were built in UTC. All dates are now built from local parts.
- **Docs fix.** The Setup SQL now matches the table the app actually uses (`tracker`) and enables realtime for it.

### v4.0
- **Forgot password (OTP)** — login screen now has a "Forgot password?" link. Enter your email, get a code, type it in with a new password — no clicking a link that dumps you somewhere unexpected. Requires your Supabase "Reset Password" email template to include `{{ .Token }}` (see Setup above).
- **Change password from Settings** — new "Security" section lets you change your password while signed in; you must re-enter your current password first. Sends `current_password` on the update request so it works whether or not your project has "Require current password when updating" turned on.
- **Wipe data actually wipes now — root cause fixed.** The themed "Type WIPE to confirm" dialog (`promptAsync`) closed itself and *then* tried to read what you'd typed from the now-deleted input field. That threw an error before `resolve()` ever ran, so the confirmation promise never resolved and `wipeAllData()` just hung silently forever — no error shown, no wipe, nothing. This affected every use of that themed prompt dialog, not just wipe. Fixed by reading the typed value before closing the dialog.
- **Wipe data hardened on top of that fix** — now writes directly to Supabase and waits for confirmation instead of relying on the normal debounced autosave (which fails silently on a flaky connection); shows an honest "Wipe failed" toast if the cloud write doesn't succeed instead of a false "wiped ✓"; closes any open sheet/drawer first so nothing holds a stale reference; and properly clears demo mode's local storage key too.

### v3.3
- **Cancelling a recurring entry no longer erases history** — removing a subscription/EMI (e.g. stopping Netflix autopay) now only stops *future* charges. If the current month was already billed, it stays; if not yet billed this month, it stops as of last month. Past months are never touched. The entry is only fully deleted if it never actually got billed (e.g. removed before its start date).

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
