# Handoff: Visual Direction Redesign

**Read this whole file before touching code.** This is a cold-start handoff for a fresh session — the prior session did discovery, design, and tooling setup, but wrote zero production code toward the redesign itself. Everything below is what that session learned; nothing has been implemented yet.

## The ask, in the user's words

Move off the current "bold minimal two-color app" (stock shadcn/ui grayscale) toward "more modern cool style looking apps," using a specific color palette the user supplied (a screenshot of a palette generator page, described below). Add "cool animation ONLY where it really helps improve UI/UX" — restraint is explicit and repeated; this is not a request for a maximalist redesign. New branch, which already exists (see below).

Two constraints the user emphasized after the initial ask:
- **"I am not sure about this part, where we tap to make item crossed, because some of them have their naming in two rows so crossed line is in the middle!"** — caught a real bug in the first draft of the checkbox strike-through animation. See "Lesson learned" below; don't reintroduce this.
- **"I am 99% of my time use this on my mobile's browser."** — this is a mobile-first redesign, full stop. Desktop is secondary. Every visual decision and every verification step should happen at phone viewport width (~375–390px) first.

Also discussed and explicitly decided **out of scope** for this redesign:
- Tailwind v4 migration — flagged as a good idea in the abstract, but a separate, orthogonal decision. Don't bundle it in.
- URL-encoded shopping-list sharing (a long-standing idea of the user's) — good complementary idea for a *different* use case (share a read-only snapshot with someone outside the app), but it does not replace backlog issue #6 (`shared-list-sync`, live DB-backed sync between the two real household users). Not part of this redesign.

## Where things stand

- **Branch**: `feature/ui-ux-improvements-theme`, already created and checked out. Working tree is clean.
- **Base**: branches from `main`, which itself already contains all of this project's prior backend work (issues #1, #3, #4, #5, and an unrelated session-cookie security bugfix) as two commits (`dcb13ba`, `3971ea9`). That work is done and out of scope here — don't touch `src/lib/services/`, `src/lib/session.ts`'s auth logic, `src/middleware.ts`'s redirect logic, etc. unless the redesign specifically requires restyling something they render.
- **One commit on top of main so far**: `2b16245` — added `playwright` as a devDependency. See "Verification tooling" below for why and how to use it.
- Full `.issues/*.md` backlog and `plans/prd-architecture-ux-improvements.md` are already committed and describe the *other* (non-visual) workstream. That PRD's own "Out of Scope" section explicitly excludes "Visual/theme redesign beyond what's needed for the specific fixes listed" — meaning this redesign is a deliberate second, separate initiative, not a continuation of that PRD.

## The visual direction — read the artifact first

A pitch artifact was built and iterated on with the user during the prior session:

**<https://claude.ai/code/artifact/fd62dd6d-cdef-40c2-b3c0-5d3feac8eca1>**

Fetch it (`WebFetch` works on `claude.ai/code/artifact/...` URLs) or ask the user to open it before writing any component code. It contains real markup (not abstract mockups) for: buttons, a product card, a phone-framed shopping-list item with a working checkbox/strike-through/quantity-stepper interaction, a phone-framed bottom nav with a sliding active pill, a like button with a burst animation, and a toast. It's self-contained HTML/CSS/JS — the actual CSS in it is a reasonable starting point to port into `globals.css` and the relevant components, not just a mood reference.

The user reviewed it, caught the strikethrough bug (fixed in the artifact already), asked about URL sharing (unrelated, resolved as out of scope, see above), and then asked to hand off — so **the artifact's current published state has NOT been re-reviewed by the user since the fix.** Don't assume final sign-off on every last detail; treat it as "strong direction, last-reviewed-minus-one-fix," and stay open to further adjustment once real components are restyled.

## Color palette (locked — user-provided, exact values)

Source: a palette-generator screenshot titled "In-App Purchases Color Palette," described in-page as "inspired from an image of In-app purchases screens. Sleek banking app UI with mint green accents... minimalist design... conveying trust and simplicity." Do not substitute or "improve" these hex values — they're a direct user requirement, not a suggestion.

| Name | Hex | HSL | Suggested role |
|---|---|---|---|
| Lynx White | `#F9F7F6` | `20 20% 97%` | Light-mode background |
| Toxic Essence | `#CEE9BD` | `97 50% 83%` | Primary accent (CTAs, active states, highlights) |
| Light Weathered Hide | `#E0D5CF` | `21 22% 85%` | Warm neutral surface / secondary background |
| Arbor Vitae | `#BCC5AD` | `83 17% 73%` | Secondary accent, borders, muted fills |
| Chicago | `#5C5E58` | `80 3% 36%` | Muted/secondary text; dark-mode elevated surface |
| Black Metal | `#050504` | `60 11% 2%` | Primary text (light mode); dark-mode background |

The artifact's `<style>` block already has a worked HSL token system (`--bg`, `--bg-raised`, `--accent`, `--accent-ink`, `--warm`, `--sage`, `--slate`, `--ink`) with both a `prefers-color-scheme: dark` block and `[data-theme="dark"]` / `[data-theme="light"]` overrides — that's a reasonable starting point for what needs to replace the tokens in `src/app/globals.css`, which today are pure grayscale shadcn defaults (zero saturation on every single token — that's the literal "bold minimal two-color" the user means). `--accent-ink` in the artifact is a *derived* darker/more-saturated version of the mint used for text-on-mint and icon-fill contexts — not one of the six named colors — because the raw mint fails contrast for text/icons on light backgrounds. Keep that derived-token pattern; don't try to use raw Toxic Essence for text.

## Typography — don't introduce a new font

The app already loads **Poppins** via `next/font/google` in `src/ui/fonts.ts` (weights 100/300/400/500; an unused `Inter` export also exists there — check whether anything actually renders with it before assuming it matters). The rendered `<body>` class in dev output already shows a Poppins module class, so it's live. Restyle *within* Poppins — don't add a second typeface to the real app. (The artifact pitch itself used a system-rounded font for its own throwaway chrome/headline, since it's a disposable pitch page, not the product — that choice doesn't carry over to the actual app.)

## The five animation touchpoints — and only these

Explicit, deliberate list from the design discussion. Everything else (product grids, category lists, form fields, static text) stays still on purpose — the user does not want ambient motion while scanning a list quickly in a store.

1. **Like/favorite button** — a quick mint "burst" + heart fill-in on tap. Component: `src/components/Product/LikeButtonsSet.tsx` (already has a correct `aria-label` and an auth gate from prior work — just needs the animation layer, no logic changes).
2. **Shopping-list checkbox check-off** — row tints toward the mint accent, checkmark draws in, name gets a strikethrough. Component: `src/app/(private)/shopping-list/components/ShoppingListItem.tsx` (already wired to persist `checked` via a server action from prior work — purely a restyle/animate task, not new logic).
3. **Bottom nav active-state slide** — a pill slides under the active tab instead of a static class swap. **Component: `src/components/Footer.tsx`**, not a component named "nav" — this project's actual thumb-reachable mobile bottom bar is the `md:hidden` icon row inside `Footer.tsx` (lines ~25–46). Confirmed while researching this handoff: it has the exact bug described in `.issues/012-bottom-nav-active-state.md` — `pathname` is read from `(await headers()).get("x-invoke-path")`, a header Next.js does not actually set, so it's always `""` and the active-state class never applies; the icons also have zero accessible labels (no `aria-label`, no `sr-only` text). **Strongly consider doing issue #12's actual fix (read the real path via `usePathname()`, the same pattern already used correctly in `src/components/Sidebar/NavLinks.tsx`, plus add labels) as part of this same touchpoint** — you're restyling and animating this exact element anyway; fixing the underlying bug in the same pass avoids animating a currently-broken feature and touching the file twice.
4. **Quantity stepper** — the number "ticks" (small vertical slide + fade) when incremented/decremented. Component: `src/components/Product/AddToCartSection.tsx`.
5. **Toast entrance/exit** — soft spring in, mint left-edge accent for success, instead of the current default shadcn slide. Components: `src/components/ui/toast.tsx` / `src/components/ui/toaster.tsx`, `src/hooks/use-toast.ts`.

All five have a working reference implementation in the artifact's CSS/JS (search for `.like-btn`, `.list-row`/`.check`/`.item-name`, `.nav-pill`, `.qty-stepper`/`.qty-value`, `.toast` respectively).

Respect `prefers-reduced-motion` for all five — the artifact already has a blanket `@media (prefers-reduced-motion: reduce)` rule collapsing all transition/animation durations; port that pattern (or an equivalent) into the real app's global CSS.

## Lesson learned — don't repeat this bug

The first draft of touchpoint #2's strikethrough used an absolutely-positioned `::after` pseudo-element at `top: 50%` of the name element, animated via `width`. It breaks the instant a product name wraps to two lines — the line lands in the gap between the lines instead of through either one, because `top: 50%` is relative to the whole (now taller) element. Screenshot from the user showed this exactly on "Sourdough bread" / "Cherry tomatoes."

**Fix applied in the artifact (port this, don't reintroduce the bug):** use native `text-decoration-line: line-through` with `text-decoration-color: transparent` transitioning to a solid color on check — CSS handles multi-line strikethrough correctly on its own, no positioning math needed. Paired with `white-space: nowrap; text-overflow: ellipsis; overflow: hidden; min-width: 0` on the name so it matches the real app's existing single-line-truncation behavior (`src/components/Product/ProductName.tsx` already truncates with a tap-reachable tooltip for the full name — the artifact's list-item demo now mirrors that rather than diverging from it).

## Mobile-first — concretely, not just in spirit

- Verify everything at ~375–390px viewport width *first*. Desktop is secondary.
- The checkbox's real tap target must be the whole row, not the small visual box (issue #11 territory — check whether #11 has already been implemented by the time you pick this up; if not, this redesign's restyle of `ShoppingListItem.tsx` is a natural place to also land that fix, same reasoning as the bottom-nav bug above).
- No interaction should depend on `:hover` alone — every tappable element needs a visible `:active` state (the artifact's buttons use `transform: scale(0.96)` on `:active`; the product-card hover-lift is fine to keep as a harmless desktop-only enhancement since it simply won't trigger on touch, but don't make it load-bearing for any affordance).
- Quantity-stepper and similar small controls: keep real tap targets reasonably large even where the visual chrome is compact (the artifact bumped `.qty-stepper button` from an initial 22px to 32px during review for exactly this reason — check current sizing in whatever you build against actual thumb-sized taps, not just visual balance).

## Verification tooling set up this session

No `chromium-cli` or any headless-browser tool was available in this environment. Rather than reason about CSS/animation changes blind, `playwright` was added as a devDependency (commit `2b16245`) and its Chromium binary installed via `npx playwright install chromium --with-deps`. A throwaway Node script (session-scratchpad-only, did not survive to this repo) drove it like this — recreate something equivalent rather than hunting for the deleted original:

```js
const { chromium } = require("playwright");
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, // iPhone-ish mobile width — use this by default
  colorScheme: "light", // or "dark" — check both
});
const page = await context.newPage();
page.on("console", (msg) => msg.type() === "error" && console.error(msg.text()));
await page.goto("http://localhost:3000/...", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/shot.png" });
await browser.close();
```

**Strongly recommended next step: run `/run-skill-generator`** to turn this into a proper committed project skill (per this project's own `run` skill: "If the fallback pattern didn't work out of the box... recommend `/run-skill-generator` so that work gets captured as a project skill"). That makes mobile-viewport screenshot verification a one-command operation for every future session touching this app's UI, instead of everyone re-deriving the same Playwright boilerplate. Do this before or right after starting the redesign work — it'll pay for itself immediately given how much of this task is "does this actually look/animate right on a phone."

Dev server: `npm run dev` (Next.js + Turbopack, port 3000). Poll `curl -sf http://localhost:3000` in a loop rather than a blind `sleep` — first compile can take several seconds. Note: plain `timeout` is not available in this macOS environment's default shell (no GNU coreutils) — use a manual polling loop instead, e.g. `i=0; while [ $i -lt 20 ]; do curl -sf ... && break; sleep 1; i=$((i+1)); done`.

## Suggested approach

Tracer-bullet by component, not all-at-once:
1. Port the token system into `src/app/globals.css` (light + dark) and check `tailwind.config.ts`'s `--radius` — the artifact leans on noticeably softer/larger radii (14–20px) than the current `0.5rem` default. Screenshot a few existing pages at mobile width immediately after this step alone — token changes cascade everywhere via shadcn's `hsl(var(--x))` pattern, so this is the highest-leverage, highest-risk single change. Confirm nothing looks broken before moving on.
2. Restyle primitives (`button.tsx`, `card.tsx`) — small, low-risk, affects everything downstream.
3. One animation touchpoint at a time, screenshotting mobile-width before/after each: like button → checkbox → bottom nav (+ its real bug fix) → quantity stepper → toast.
4. Full pass: `npm test`, `npx tsc --noEmit`, `npm run lint`, then a manual pass through the real app at mobile width in both light and dark.
5. Ask the user to actually check it on their phone before considering any of this "done" — that's the real environment, and this whole redesign started from them noticing things you can't fully evaluate from a desktop screenshot alone.

This is genuinely a multi-session-sized effort — don't try to land all five touchpoints plus the full token migration in one sitting. Land the tokens + primitives first as their own reviewable unit.
