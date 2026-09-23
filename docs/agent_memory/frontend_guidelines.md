# Fan Hub Plus — Frontend Guidelines

> **AGENT INSTRUCTION**: This file defines non-negotiable structural and technical UI standards.
> Do NOT include any color schemes, gradients, or branding themes here — the visual theme
> is provided separately. Read this file before scaffolding or modifying any client-side code.

---

## 1. Typography

### Fonts in Use

| Role     | Font Family | Weight Variants       | Applied To                                       |
|----------|-------------|----------------------|--------------------------------------------------|
| Headings | **Poppins** | 600 (SemiBold), 700 (Bold) | `h1`–`h4`, hero text, card titles, nav brand |
| Body     | **Inter**   | 400 (Regular), 500 (Medium) | Paragraphs, labels, inputs, descriptions   |

### Implementation Rule — `next/font/google` (MANDATORY)

Both fonts **must** be loaded exclusively via `next/font/google`. Direct `<link>` tags to Google Fonts CDN, `@import` in CSS, or any runtime font-fetching strategy are **forbidden**.

**Rationale**: `next/font/google` downloads fonts at build time, self-hosts them on Vercel's CDN, and injects `font-display: swap` automatically — eliminating cumulative layout shift (CLS) and removing external network round-trips on page load.

```
Implementation Location: client/src/app/layout.tsx

Steps:
1. Import both fonts from 'next/font/google'
2. Declare font objects with subsets: ['latin'] and variable CSS custom properties
3. Apply font.variable class names to the root <html> element
4. Configure Tailwind fontFamily to consume the CSS variables
```

**Tailwind `tailwind.config.ts` font mapping (reference — do not alter without updating here):**

```
theme.extend.fontFamily:
  heading: ['var(--font-poppins)', 'sans-serif']
  body:    ['var(--font-inter)', 'sans-serif']
  sans:    ['var(--font-inter)', 'sans-serif']   ← override Tailwind default
```

**Typography scale (Tailwind utility mapping):**

| Element        | Classes                                     |
|----------------|---------------------------------------------|
| Page title     | `font-heading text-4xl font-bold`           |
| Section heading| `font-heading text-2xl font-semibold`       |
| Card title     | `font-heading text-lg font-semibold`        |
| Body text      | `font-body text-base font-normal`           |
| Caption / meta | `font-body text-sm font-normal`             |
| Button label   | `font-body text-sm font-medium`             |
| Input text     | `font-body text-sm font-normal`             |

---

## 2. Responsive Architecture

### Breakpoint Strategy — Mobile-First (MANDATORY)

All layout styling must be written **mobile-first**: base styles target the smallest viewport, and larger breakpoints are added progressively using Tailwind's responsive prefixes.

```
CORRECT:   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
INCORRECT: className="grid grid-cols-4 lg:grid-cols-4 sm:grid-cols-2"  ← desktop-first
```

**Tailwind Breakpoints in Use:**

| Prefix | Min-Width | Target Devices                        |
|--------|-----------|---------------------------------------|
| (base) | 0px       | Mobile portrait (320px+)              |
| `sm:`  | 640px     | Mobile landscape, small tablets       |
| `md:`  | 768px     | Tablets                               |
| `lg:`  | 1024px    | Laptops, small desktops               |
| `xl:`  | 1280px    | Full desktops                         |
| `2xl:` | 1536px    | Large monitors                        |

### PostCSS & Autoprefixer Configuration

PostCSS with Autoprefixer **must** be configured in `postcss.config.js` to generate vendor-prefixed CSS automatically. This prevents layout breakage on:

- **Chrome** (Blink) — primary target
- **Safari** (WebKit) — critical for iOS users, requires `-webkit-` prefixes for flex/grid edge cases
- **Firefox** (Gecko) — `scrollbar-width`, custom properties compatibility

```
Required postcss.config.js plugins (in order):
  1. tailwindcss
  2. autoprefixer          ← generates -webkit-, -moz- prefixes at build time
```

**Do NOT** use browser-specific CSS hacks in component files. Let Autoprefixer handle all prefixing.

---

## 3. UI Enhancements & Accessibility

### 3.1 Transitions

All interactive and media-heavy UI elements must include smooth CSS transitions. No element should appear or change state abruptly.

| Element Type              | Required Transition                                    |
|---------------------------|--------------------------------------------------------|
| Navigation links          | `transition-colors duration-200 ease-in-out`          |
| Buttons (hover/active)    | `transition-all duration-150 ease-in-out`             |
| Content cards (hover)     | `transition-transform duration-200 ease-in-out`       |
| Modal / overlay open      | `transition-opacity duration-300 ease-in-out`         |
| Video player load         | `transition-opacity duration-500 ease-in` (fade-in)  |
| Category banners          | `transition-all duration-300 ease-in-out`             |
| Sidebar collapse/expand   | `transition-width duration-250 ease-in-out`           |
| Toast notifications       | `transition-transform duration-300 ease-out` (slide)  |

**Rule**: Use Tailwind transition utilities exclusively. Do NOT write raw CSS `transition` properties in `<style>` blocks or inline styles.

### 3.2 Loading Spinners

A loading spinner or skeleton screen **must** be present on every media-heavy page. Bare white screens during loading are not acceptable.

| Page / Context             | Required Loading UI                                    |
|----------------------------|--------------------------------------------------------|
| Content detail page        | Full-page skeleton (poster + metadata layout)          |
| Video player (`Suspense`)  | `PlayerSkeleton.tsx` — 16:9 aspect ratio box with spinner |
| Category content grid      | Grid of `ContentCard` skeletons (`loading.tsx`)        |
| Dashboard                  | Section-level skeletons for each widget                |
| Search results             | Skeleton grid while query is in-flight                 |
| Character profile          | Profile skeleton (image + text lines)                  |
| Admin tables               | Animated row placeholders                              |

**Spinner component rule**: Use a single reusable `Spinner.tsx` component from `client/src/components/ui/`. It must accept a `size` prop (`sm | md | lg`) and apply `animate-spin` via Tailwind. Do NOT use GIF spinners.

**Skeleton rule**: Skeletons use `animate-pulse` on placeholder `<div>` elements. Match the skeleton shape to the actual content layout (do not use a generic rectangle for everything).

### 3.3 Breadcrumbs — MANDATORY on All Category & Content Pages

Breadcrumbs must be implemented on every page within a fandom category to provide navigational clarity.

**Breadcrumb Component**: `client/src/components/ui/Breadcrumb.tsx`

**Required breadcrumb trails by page:**

| Page                   | Breadcrumb Trail                                               |
|------------------------|----------------------------------------------------------------|
| Category listing       | `Home > [Category Name]`                                       |
| Content detail         | `Home > [Category Name] > [Content Title]`                     |
| Character profile      | `Home > [Category Name] > [Content Title] > [Character Name]` |
| Admin content list     | `Admin > Content`                                              |
| Admin content edit     | `Admin > Content > Edit: [Title]`                             |
| Admin users            | `Admin > Users`                                                |

**Accessibility requirements for Breadcrumb:**
- Wrap in `<nav aria-label="Breadcrumb">` element.
- Use `<ol>` list structure (semantically correct for ordered navigation path).
- Last item must have `aria-current="page"` attribute.
- All non-last items must be `<Link>` components (Next.js), not `<a>` tags.

---

## 4. Media Performance

### 4.1 Images — Next.js `<Image>` Component (MANDATORY)

Every image rendered in the application — static or dynamic — **must** use the Next.js `<Image>` component from `next/image`.

**Forbidden patterns:**
```
❌  <img src="..." />                          ← raw HTML img tag
❌  <img src={posterUrl} loading="lazy" />     ← manual lazy loading
❌  style={{ backgroundImage: `url(${src})` }} ← CSS background image for content
```

**Required pattern:**
```
✅  <Image src={posterUrl} alt="..." width={300} height={450} />
✅  <Image src={bannerUrl} alt="..." fill className="object-cover" />
```

**Benefits enforced automatically:**
- WebP / AVIF conversion at serving time
- Automatic lazy loading (loads only when in viewport)
- Prevents CLS via reserved layout space (`width`/`height` or `fill`)
- Served via Vercel's Image Optimization CDN

**`next.config.js` `images` domain allowlist (must be kept up to date):**

```
Allowed remote domains:
  - image.tmdb.org          ← TMDB poster/backdrop images
  - img.youtube.com         ← YouTube thumbnail fallbacks
  - (any admin-uploaded avatar CDN as added later)
```

**Sizing guidelines:**

| Image Context          | Strategy              | Example Props                                       |
|------------------------|-----------------------|-----------------------------------------------------|
| Content card poster    | Fixed size            | `width={300} height={450} sizes="(max-width: 640px) 100vw, 300px"` |
| Category hero banner   | Fill container        | `fill className="object-cover object-center"`       |
| Character profile pic  | Fixed size            | `width={200} height={200} className="rounded-full"` |
| User avatar            | Fixed size            | `width={40} height={40} className="rounded-full"`   |
| Homepage hero          | Fill container        | `fill priority className="object-cover"`            |

**`priority` prop rule**: Set `priority={true}` only on above-the-fold images (homepage hero, category banner). All other images use the default lazy loading.

### 4.2 External Video iframes — 16:9 Responsive Container (MANDATORY)

All embedded video iframes (VidSrc, Doodstream, YouTube trailers, etc.) **must** be wrapped in a responsive 16:9 aspect-ratio container. No iframe may render with a fixed pixel height.

**Container pattern (enforced in `VideoPlayer.tsx`):**

```
Wrapper:  relative w-full aspect-video overflow-hidden rounded-lg
iframe:   absolute inset-0 w-full h-full border-0
```

Tailwind's `aspect-video` utility resolves to `aspect-ratio: 16 / 9` which is supported in all modern browsers. For legacy support, Autoprefixer handles vendor prefixes.

**iframe security attributes (required on every embed):**

```
allowFullScreen
referrerPolicy="no-referrer"
sandbox="allow-scripts allow-same-origin allow-presentation"
loading="lazy"
```

**CSP note**: The `next.config.js` Content Security Policy `frame-src` directive must whitelist all permitted embed domains. The agent must update `next.config.js` whenever a new embed source is added.

---

## 5. Resilience & Fallbacks

### 5.1 Global Error Boundary

A React error boundary **must** wrap the main application tree to catch unexpected render errors and display a user-friendly fallback UI instead of a blank/broken screen.

```
Implementation: client/src/app/error.tsx   ← Next.js App Router built-in error boundary
                client/src/app/(main)/error.tsx  ← Section-level boundary
                client/src/app/admin/error.tsx   ← Admin section boundary
```

**`error.tsx` requirements:**
- Must be a `'use client'` component (React error boundaries require client-side rendering).
- Must display a user-facing message (not a raw stack trace).
- Must provide a "Try Again" button that calls the `reset()` function provided by Next.js.
- Must NOT expose error details (stack trace, file paths) in production.

### 5.2 Toast Notifications — API Error Handling (MANDATORY)

All API error responses must be communicated to the user via **toast notifications**. Modal popups or inline alert banners are not used for API errors (they are disruptive or easily missed).

**Toast library**: Use [`react-hot-toast`](https://react-hot-toast.com/) or [`sonner`](https://sonner.emilkowal.ski/) — choose one and remain consistent across the entire project. Do NOT mix toast libraries.

**Toast placement**: Top-right corner on desktop, top-center on mobile.

**Toast trigger rules:**

| Event                              | Toast Type  | Message Example                                 |
|------------------------------------|-------------|--------------------------------------------------|
| API request returns 4xx/5xx        | `error`     | "Something went wrong. Please try again."        |
| Network error / fetch failure      | `error`     | "No connection. Check your internet."            |
| Bookmark saved successfully        | `success`   | "Bookmarked! Find it in your dashboard."         |
| Bookmark removed                   | `success`   | "Bookmark removed."                              |
| Login failed (wrong credentials)   | `error`     | "Invalid email or password."                     |
| Session expired (401 on refresh)   | `error`     | "Session expired. Please log in again."          |
| TMDB sync job queued (admin)       | `success`   | "Sync job queued successfully."                  |
| Content published (admin)          | `success`   | "Content is now live."                           |
| Form validation error              | `error`     | Field-specific message (from express-validator)  |

**Rule**: The `lib/api.ts` Axios instance response interceptor must catch all non-2xx responses and call the toast library automatically. Individual components should NOT manually call toast on generic API errors.

**Toast duration**: 4000ms default. Errors may extend to 6000ms. Success toasts auto-dismiss at 3000ms.

### 5.3 TMDB Poster Fallback — Local Placeholder (MANDATORY)

External TMDB poster images may fail to load (network error, missing poster_path, invalid URL). Every `<Image>` rendering a TMDB poster **must** handle this case gracefully.

**Fallback file**: `client/public/images/poster-placeholder.png`
- Dimensions: 300×450px (matches standard movie poster aspect ratio 2:3)
- Content: A neutral placeholder graphic (designed later as part of the visual theme)

**Implementation pattern in `ContentCard.tsx` and all poster usages:**

```
1. Maintain a boolean state: imgError = false
2. Set <Image onError={() => setImgError(true)} ... />
3. If imgError is true, render <Image src="/images/poster-placeholder.png" ... /> instead
4. Always provide a descriptive alt text even for the placeholder: alt={`${title} — poster unavailable`}
```

**Additional fallback rules:**

| Asset Type          | Fallback Asset                               |
|---------------------|----------------------------------------------|
| TMDB poster         | `public/images/poster-placeholder.png`       |
| TMDB backdrop       | `public/images/backdrop-placeholder.png`     |
| User avatar         | `public/images/avatar-placeholder.png`       |
| Category banner     | `public/images/banner-placeholder.png`       |
| Character image     | `public/images/character-placeholder.png`    |

**Rule**: All placeholder files must exist in `client/public/images/` before any component that uses them is implemented.

---

## 6. Accessibility Standards (WCAG 2.1 AA — Minimum)

| Standard                  | Requirement                                                         |
|---------------------------|---------------------------------------------------------------------|
| Keyboard navigation       | All interactive elements reachable and operable via Tab/Enter/Space |
| Focus indicators          | Never remove `outline` without providing a custom `ring` alternative |
| Alt text                  | Every `<Image>` must have a non-empty, descriptive `alt` prop       |
| ARIA labels               | Icon-only buttons must have `aria-label`                            |
| Semantic HTML             | Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>` appropriately |
| Form labels               | Every input must have an associated `<label>` (not placeholder-only)|
| Loading states            | Loading spinners must include `aria-live="polite"` or `role="status"` |
| Error messages            | Form errors must be associated with inputs via `aria-describedby`   |

---

## 7. Component File Standards

| Rule | Detail |
|------|--------|
| `'use client'` directive | Only add to components that use browser APIs, hooks (useState, useEffect), or event handlers. Server Components are the default. |
| No inline styles | Zero `style={{ }}` props except for dynamic values that cannot be expressed in Tailwind (e.g., dynamic `transform` values). |
| No `px`/`rem` hardcoding | Use Tailwind spacing scale exclusively. Never write `style={{ marginTop: '24px' }}`. |
| Import order | 1. React/Next.js imports → 2. Third-party → 3. Internal `@/` aliases → 4. Types |
| Path aliases | Use `@/` alias for all internal imports (configured in `tsconfig.json` `paths`). No relative `../../` imports beyond one level. |
| Component naming | PascalCase for component files and function names. `kebab-case` for page directories (Next.js convention). |
