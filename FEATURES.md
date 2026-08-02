# TheLittleNaga — Everything You Can Do

A plain-language walkthrough of every feature in the app, tab by tab. Written so you can read it once and know exactly what's possible — no digging through menus to find out.

---

## Home (Dashboard)

- Shows this month's **salary, other income, carry-in balance, and remaining balance**, with a live tone indicator (goes red/loud when you're overspending, quiet when you're fine).
- **Tap the month pill** (top right) to jump to any month, past or future.
- **+ button** (bottom right, Home only) opens the add-expense sheet.
- **Recent Transactions** panel — tap "View all" to go to the full Transactions tab.
- **Swipe left/right** anywhere in the *bottom half* of the screen to move between Home → Transactions → Analytics → Savings → Budgets → Recurring. (Settings is intentionally left out of this ring so you can't swipe into it by accident.)
- **Pull down from the top** to refresh from the cloud.

## Transactions

- Every expense for the selected month, grouped by date, newest first.
- **Search box** — filters by note, category, sub-category, amount, or date, all at once.
- **Category filter (dropdown)** — tap it to open a full-width panel with a checkbox list of every category you've actually used this month. You can select **one, several, or all of them**; there's a filter box inside the dropdown too if your category list is long. The total transaction count and amount at the top updates live as you change the selection. "Clear (show all)" resets it.
- Tap any transaction to edit it; long-press on mobile also works.
- Expenses marked "Paid with CC" show a card icon and don't count against this month's balance — they roll into next month's credit card bill instead.

## Analytics

- Four time views: **Daily, Weekly, Monthly (12mo), Yearly**.
- **Chart type switcher** — Bar (stacked), Line, Pie, Doughnut. Bar/Line show spend over time per category; Pie/Doughnut show the split of total spend across categories for the period you're viewing.
- **Category Breakdown** list below the chart — sorted by highest spend first. Once you have more than 8 categories with spend in a period, it collapses to the top 8 with a "Show all" button, and gets a search box so you can jump straight to one category instead of scrolling.

## Savings

- **This Month / Carry-in Balance / Best Month / Avg Savings Rate** at a glance.
- **12-month Income vs Expenses chart** — bar for income/expenses, line for net savings. Swiping/scrolling inside this chart or the table below it will not flip you to another tab; that gesture is reserved for the tab-swipe zone elsewhere on screen.
- **Monthly Summary table** — scrollable horizontally. Columns: Month, Salary, +Others, Carry In, Expenses, **Saved This Month** (what you kept that month), **Balance Carried Forward** (Carry In + Saved — what rolls into the next month).

## Budgets

- Set a monthly ₹ limit per category; the progress bar fills live as you log expenses in that category.
- Categories with no limit set show "No limit" and don't clutter the page with a progress bar.
- **Tithe is excluded from this tab by default** (it doesn't make sense to "budget" a giving category), but you can bring back any category — or hide any other one — from **Settings → Manage Categories** (see below).
- Going over budget is visually loud (red, "OVER BUDGET"); staying under is quiet.

## Recurring (EMIs, Loans, Subscriptions)

- Add anything that repeats monthly: EMIs, loans, rent, Netflix, gym, UPI autopay, etc.
- **Months is optional now** — leave it blank for anything open-ended (a subscription with no fixed end date); the app treats blank the same as 999 (effectively forever). Fill it in only when there's a real end date, like a 24-month loan.
- **Your draft is autosaved** — if you're mid-way through typing a new recurring entry and you switch apps, get a call, or Android kills the app in the background, come back and everything you'd typed is still there. It only clears once you actually hit "Add".
- **Due-day aware balance** — if something is due on the 4th and today is the 1st, it won't be deducted from your balance yet. It only counts once its due day actually arrives in the real world. (Past months are unaffected — anything already billed stays billed.)
- **Prepay remaining EMIs** — one tap on any split-EMI row folds all its remaining months into today.
- Removing a recurring entry only stops *future* charges — anything already billed this month or earlier stays in your history.

## Notifications

- One dedicated, full page — budget alerts (50/80/100%) and credit card bill reminders, newest first, with generous spacing instead of a cramped list.
- Unread ones are marked with a left accent stripe and a "NEW" tag.
- Tap a notification to jump straight to what it's about (e.g. straight into the CC bill allocator, or the Budgets tab).
- "Clear all" wipes the list. Individual ✕ dismisses one at a time.

## Settings

- **Profile** — change your display name; see your email and avatar initial.
- **Security** — change your password (requires your current password) or reset a forgotten one via a 6-digit email code (no link-click needed).
- **Themes** — 5 total: Noir, Paper, Lagoon, Sunset, Monet. Switches instantly, saved per device.
- **Currency** — 20 currencies; your choice syncs across devices.
- **Manage Categories** — rename or recolor any category (built-in or custom), add sub-categories, add brand-new custom categories, delete custom ones. **New:** a target/eye icon on each row toggles whether that category shows up on the Budgets tab at all — handy for categories you never want to cap (like Tithe) or ones you do.
- **Notifications toggle** — turn budget/CC alerts on or off; on Chrome PWA these become real background OS push notifications, on the Android APK they show as in-app banners.
- **Wipe data** — permanently erases everything for your account (type "WIPE" to confirm).

## Navigation (Android back button / swipe-back gesture)

- From any top-level tab (Transactions, Analytics, Savings, Budgets, Recurring, Settings, Notifications), one back-press takes you straight to **Home**. It no longer closes the app from inside a tab.
- From a page nested inside Settings (Manage Categories, Currency), one back-press takes you to **Settings**, and a second takes you to **Home** — it unwinds one level at a time, the way you'd expect.
- If a sheet, drawer, or dialog is open, back closes *that* first, before touching navigation.
- From Home, with nothing else open, back behaves normally (minimizes/exits the app) — that part hasn't changed.

## Everything else (unchanged, still there)

- Live cloud sync via Supabase — realtime across devices, pull-to-refresh on mobile.
- Smart credit-card tracking with a per-charge bill allocator and FIFO custom-amount fill.
- Split-into-EMI with optional annual interest and live preview.
- IST-aware dates (Asia/Kolkata "now"), themed dialogs everywhere (no native browser popups), haptic feedback, bottom-sheet forms, view-transition animations.

---

*This file is just documentation — it isn't loaded by the app and has no effect on how it runs. Delete it, edit it, or keep it next to `index.html`, whatever's convenient.*
