# ₹ Ledger — UI/UX Redesign v2.0

A fully reimagined drop-in `index.html` replacement. **Web view on desktop, app view on mobile** — automatically detected. Same Supabase backend. Now with **20 currencies**.

## Install (1 step)

Replace your current `index.html` with `/app/redesign/index.html`. Your `sw.js` and `manifest.json` work as-is.

## What's new in v2.0

### Dual-mode experience
- **Desktop / web**: Sidebar + topbar, multi-column grid, hero balance card, full-width charts
- **Mobile / app**: Native-feeling — bottom-floating dock, FAB for quick-add, bottom sheets, scaled drawer animation, no inline forms cluttering the screen
- Auto-detected via viewport + user-agent (no toggle needed)

### Cinematic auth (clean & minimal)
- Animated **aurora gradient** background (drifts continuously, theme-aware)
- Centered logo + login card — no marketing copy, just sign in
- **"Try demo mode"** button — explore the entire app with sample data, no account needed (local-only)
- Glass-morphism card with arrow-pill button

### Settings page (new!)
Theme picker and currency picker moved here for a cleaner sidebar.
- **5 theme cards** with live gradient previews — Noir, Paper, Lagoon, Sunset, Monet
- **20-currency grid** — INR, USD, EUR, GBP, JPY, CNY, KRW, AUD, CAD, SGD, AED, SAR, CHF, BRL, NGN, TRY, RUB, IDR, PKR, BDT — each with its symbol + native locale formatting
- **Account section** — backup, sign out, about

### Multi-currency engine
- All amounts auto-format using `Intl.NumberFormat` per currency's native locale
  - `₹95,000` (Indian grouping), `$1,500` (US), `1.500 €` (EUR-DE), `¥150,000` (JP)
- Dynamic symbols throughout (Salary, Add Expense, Budgets, EMIs all reflect chosen currency)
- Currency choice **syncs** across all your devices via Supabase

### Fancy transitions (the "go crazy" part)
- **View Transitions API** — buttery cross-fades on every tab switch
- **Theme switch radial reveal** — tap a theme card, the new theme washes in like a wave from your tap point
- **Page slide + blur** out / in
- **Card stagger** — category cards fade in one by one
- **Aurora drift** on auth screen (12s organic loop)
- **Smooth chart fade-ins**, animated progress bar fills, hover-lift on cards

### Mobile-first interactions
- **FAB (floating action button)** bottom-right → opens bottom sheet for add-expense
- **Bottom-sheet "Pick month"** → tappable month grid (no more arrow-clicking)
- **Drawer animation** (Android-recents): tap menu → main view scales 88% + slides 78% right with rounded corners + shadow, sidebar revealed beneath
- **Floating glass dock** at bottom — 5 tabs in a pill with backdrop-blur
- **Swipe between tabs** — drag horizontally to navigate Home → Charts → Save → Budget → EMI → Settings (and back)
- **Pull-to-refresh** — drag down at the top of any page → refreshes data from cloud (or re-renders in demo mode)

### Layout improvements
- New **hero balance card** on home — large monospace remaining amount + serif italic dynamic quote ("Plenty of runway." / "Mid-month, on track." / "Tightening up nicely." / "Time to slow the spend.")
- Logo refresh: small accent-tile "L" + serif "Led*ger*"
- Lucide icons throughout (no emoji)
- Grain texture overlays on dark themes
- Sticky topbar with scroll-blur

## Themes (5)

| Theme   | Mood                                                      |
|---------|-----------------------------------------------------------|
| Noir    | Pure AMOLED black + lime accent — editorial fintech       |
| Paper   | Cream + ink black + olive — Notion-style light            |
| Lagoon  | Midnight navy + electric cyan                             |
| Sunset  | Warm charcoal + coral & amber                             |
| Monet   | **Dynamic** — follows your OS light/dark + accent color   |

## Currencies (20)

INR · USD · EUR · GBP · JPY · CNY · KRW · AUD · CAD · SGD · AED · SAR · CHF · BRL · NGN · TRY · RUB · IDR · PKR · BDT

Easy to extend — add more in the `CURRENCIES` array.

## Preserved 100%

- All Supabase auth, realtime sync, EMI auto-generation, carry-over math, backup export
- All element IDs / class names original JS depended on
- `sw.js` offline support
- Original 15 expense categories with subcategories

## Files

- `/app/redesign/index.html` — your drop-in replacement
- `/app/redesign/README.md` — this doc
- Live preview: `https://ui-revamp-93.preview.emergentagent.com/ledger.html`

## Customization

- **Default theme**: `<html data-theme="noir">` → swap to any of the 5
- **Default currency**: in `state` object initialization, `currency:'INR'` → swap to any code
- **Add a theme**: copy any `[data-theme="..."]` block, change CSS variables, add card to settings page
- **Add a currency**: append to `CURRENCIES` array (code, symbol, locale, name)
- **Brand name**: search "Ledger" — 4 places to change
