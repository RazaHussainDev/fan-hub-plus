# Fan Hub Plus — Structure Memory (Project Directory Tree)

> **AGENT INSTRUCTION**: This is the canonical project structure. Every new file MUST be placed in the correct location as defined here. Do NOT place backend files in the client, or client files in the server. Reference this tree before creating any new file.

---

## Root Directory Layout

```
Fan_Hub/                                    ← Monorepo root (d:\Fan_Hub\)
├── client/                                 ← Next.js 14+ App (Deployed to Vercel)
├── server/                                 ← Express.js API (Deployed to Railway/Render)
├── docs/
│   └── agent_memory/                       ← AI context & memory files (THIS DIRECTORY)
│       ├── product_srs.md
│       ├── architecture_rules.md
│       ├── schema_memory.md
│       ├── flow_memory.md
│       └── structure_memory.md
├── .gitignore                              ← Root gitignore (covers both client & server)
└── README.md                              ← Project overview
```

---

## `/client` — Next.js Frontend (Full Tree)

```
client/
├── .env.local                             ← Client env vars (NEXT_PUBLIC_* only)
├── .eslintrc.json                         ← ESLint config
├── .prettierrc                            ← Prettier config
├── next.config.js                         ← Next.js config (ISR, CSP headers, image domains)
├── tailwind.config.ts                     ← Tailwind CSS config
├── tsconfig.json                          ← TypeScript config
├── package.json
│
├── public/                                ← Static assets (served at root /)
│   ├── icons/                             ← Fandom category icons
│   ├── images/                            ← Static images (logo, placeholders)
│   └── favicon.ico
│
└── src/
    ├── app/                               ← Next.js App Router (ALL routes live here)
    │   ├── layout.tsx                     ← Root layout (HTML shell, Providers, Navbar, Footer)
    │   ├── page.tsx                       ← Homepage (/) — ISR, hero + featured content
    │   ├── loading.tsx                    ← Root loading UI (Suspense fallback)
    │   ├── error.tsx                      ← Root error boundary
    │   ├── not-found.tsx                  ← 404 page
    │   │
    │   ├── (auth)/                        ← Route group — auth pages (no shared layout)
    │   │   ├── login/
    │   │   │   └── page.tsx               ← /login — CSR form
    │   │   └── register/
    │   │       └── page.tsx               ← /register — CSR form
    │   │
    │   ├── (main)/                        ← Route group — main app (shared navbar layout)
    │   │   ├── layout.tsx                 ← Main layout with Navbar + Sidebar
    │   │   ├── dashboard/
    │   │   │   └── page.tsx               ← /dashboard — Dynamic (cache: no-store), Protected
    │   │   ├── category/
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx           ← /category/[slug] — ISR (revalidate: 3600)
    │   │   │       └── loading.tsx        ← Skeleton loader for category grid
    │   │   ├── content/
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx           ← /content/[slug] — ISR + CSR player section
    │   │   │       └── loading.tsx
    │   │   ├── character/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx           ← /character/[id] — ISR (revalidate: 3600)
    │   │   ├── bookmarks/
    │   │   │   └── page.tsx               ← /bookmarks — Dynamic, Protected
    │   │   └── search/
    │   │       └── page.tsx               ← /search?q=... — Dynamic
    │   │
    │   └── admin/                         ← Admin Control Panel (Protected, role: admin)
    │       ├── layout.tsx                 ← Admin layout (sidebar nav, auth guard)
    │       ├── page.tsx                   ← /admin — Dashboard overview
    │       ├── content/
    │       │   ├── page.tsx               ← /admin/content — Content list + TMDB sync trigger
    │       │   ├── new/
    │       │   │   └── page.tsx           ← /admin/content/new — Manual content create
    │       │   └── [id]/
    │       │       └── edit/
    │       │           └── page.tsx       ← /admin/content/[id]/edit — Edit + set embed_url
    │       ├── users/
    │       │   └── page.tsx               ← /admin/users — User management
    │       ├── categories/
    │       │   └── page.tsx               ← /admin/categories — Toggle, reorder categories
    │       └── jobs/
    │           └── page.tsx               ← /admin/jobs — BullMQ job monitor
    │
    ├── components/                        ← Reusable React components
    │   ├── ui/                            ← Primitive UI components (Button, Input, Modal, etc.)
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Badge.tsx
    │   │   └── Spinner.tsx
    │   ├── layout/                        ← Layout components
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── AdminSidebar.tsx
    │   ├── content/                       ← Content-related components
    │   │   ├── ContentCard.tsx            ← Content thumbnail card
    │   │   ├── ContentGrid.tsx            ← Grid of ContentCards
    │   │   ├── ContentHero.tsx            ← Hero/banner for featured content
    │   │   └── ContentDetail.tsx          ← Full detail view
    │   ├── player/                        ← Video player (CSR only)
    │   │   ├── VideoPlayer.tsx            ← 'use client' — iframe wrapper with Suspense
    │   │   ├── PlayerSkeleton.tsx         ← Loading skeleton for player
    │   │   └── PlayerControls.tsx         ← Custom overlay controls (if needed)
    │   ├── bookmark/
    │   │   ├── BookmarkButton.tsx         ← Toggle bookmark ('use client')
    │   │   └── BookmarkList.tsx           ← Dashboard bookmark grid
    │   ├── character/
    │   │   └── CharacterCard.tsx          ← Character profile card
    │   ├── category/
    │   │   ├── CategoryGrid.tsx           ← Homepage category grid
    │   │   └── CategoryBanner.tsx         ← Category hero banner
    │   ├── auth/
    │   │   ├── LoginForm.tsx              ← 'use client' form
    │   │   ├── RegisterForm.tsx           ← 'use client' form
    │   │   └── AuthGuard.tsx              ← Client-side route protection wrapper
    │   └── admin/
    │       ├── TmdbSyncForm.tsx           ← Admin TMDB sync trigger form
    │       ├── ContentTable.tsx           ← Admin content list table
    │       ├── UserTable.tsx              ← Admin user management table
    │       └── JobMonitor.tsx             ← BullMQ job status display
    │
    ├── lib/                               ← Utility libraries and singletons
    │   ├── api.ts                         ← Axios instance with JWT interceptors
    │   ├── auth.ts                        ← Token helpers (decode, check expiry)
    │   └── utils.ts                       ← General utilities (cn, formatDate, etc.)
    │
    ├── hooks/                             ← Custom React hooks
    │   ├── useAuth.ts                     ← Auth state from Zustand store
    │   ├── useBookmark.ts                 ← Bookmark toggle + optimistic update
    │   └── useInfiniteContent.ts          ← Infinite scroll for content grids
    │
    ├── store/                             ← Zustand global state
    │   ├── authStore.ts                   ← { user, accessToken, login, logout }
    │   └── uiStore.ts                     ← { theme, sidebarOpen, etc. }
    │
    ├── types/                             ← TypeScript type definitions
    │   ├── user.types.ts
    │   ├── content.types.ts
    │   ├── category.types.ts
    │   ├── bookmark.types.ts
    │   └── api.types.ts                   ← API response envelope types
    │
    └── middleware.ts                      ← Next.js middleware (JWT check for protected routes)
```

---

## `/server` — Express.js Backend (Full Tree)

```
server/
├── .env                                   ← Server env vars (NEVER commit this)
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json                          ← TypeScript config (target: ES2022, module: CommonJS)
├── package.json
│
└── src/
    ├── index.ts                           ← Entry point: create Express app, connect DB, start server
    │
    ├── config/                            ← Configuration modules
    │   ├── db.ts                          ← Mongoose connection to MongoDB Atlas
    │   ├── env.ts                         ← Validate and export all env vars (zod or dotenv)
    │   ├── redis.ts                       ← BullMQ Redis connection
    │   └── cors.ts                        ← CORS configuration (allowlist CLIENT_ORIGIN)
    │
    ├── routes/                            ← Express route declarations (thin layer)
    │   ├── index.ts                       ← Mount all routers under /api/v1
    │   ├── auth.routes.ts                 ← /api/v1/auth/*
    │   ├── user.routes.ts                 ← /api/v1/users/*
    │   ├── content.routes.ts              ← /api/v1/content/*
    │   ├── category.routes.ts             ← /api/v1/categories/*
    │   ├── bookmark.routes.ts             ← /api/v1/bookmarks/*
    │   ├── character.routes.ts            ← /api/v1/characters/*
    │   └── admin.routes.ts                ← /api/v1/admin/* (role-protected)
    │
    ├── controllers/                       ← Request handlers (business logic)
    │   ├── auth.controller.ts             ← register, login, logout, refresh
    │   ├── user.controller.ts             ← getProfile, updateProfile
    │   ├── content.controller.ts          ← getAll, getById, search, getByCategory
    │   ├── category.controller.ts         ← getAll, getBySlug
    │   ├── bookmark.controller.ts         ← addBookmark, removeBookmark, getUserBookmarks
    │   ├── character.controller.ts        ← getById, getByContent
    │   └── admin.controller.ts            ← CRUD for content/users/categories, triggerSync
    │
    ├── models/                            ← Mongoose schema definitions
    │   ├── User.model.ts                  ← Implements schema_memory.md > User Schema
    │   ├── Category.model.ts              ← Implements schema_memory.md > Category Schema
    │   ├── Content.model.ts               ← Implements schema_memory.md > Content Schema
    │   ├── Bookmark.model.ts              ← Implements schema_memory.md > Bookmark Schema
    │   └── Character.model.ts             ← Implements schema_memory.md > Character Schema
    │
    ├── middleware/                        ← Express middleware functions
    │   ├── auth.middleware.ts             ← verifyAccessToken (JWT validation)
    │   ├── admin.middleware.ts            ← requireAdmin (role check)
    │   ├── validate.middleware.ts         ← express-validator error handler
    │   ├── rateLimiter.middleware.ts      ← express-rate-limit config
    │   └── errorHandler.middleware.ts     ← Global async error handler
    │
    ├── validators/                        ← express-validator rule sets
    │   ├── auth.validators.ts             ← Register/login input rules
    │   ├── content.validators.ts          ← Content create/update rules
    │   └── bookmark.validators.ts         ← Bookmark create rules
    │
    ├── services/                          ← Business logic abstraction layer
    │   ├── auth.service.ts                ← Token signing, bcrypt operations
    │   ├── tmdb.service.ts                ← TMDB API fetch functions (axios calls)
    │   ├── content.service.ts             ← Content query logic
    │   └── user.service.ts                ← User query logic
    │
    ├── jobs/                              ← BullMQ background job system
    │   ├── queues/
    │   │   └── tmdbSync.queue.ts          ← Define 'tmdb-sync' BullMQ Queue
    │   ├── workers/
    │   │   └── tmdbSync.worker.ts         ← Worker: fetch TMDB → upsert Content in MongoDB
    │   └── processors/
    │       └── tmdbSync.processor.ts      ← Job processing logic (called by worker)
    │
    └── utils/                             ← Shared utility functions
        ├── asyncHandler.ts                ← Wraps async route handlers (try/catch)
        ├── ApiResponse.ts                 ← Standard API response envelope { success, data, message }
        ├── ApiError.ts                    ← Custom error class with statusCode
        └── logger.ts                      ← Winston or Pino logger setup
```

---

## File Placement Quick Reference

| What to create? | Where to place it |
|---|---|
| New page route | `client/src/app/(main)/[route-name]/page.tsx` |
| Admin page | `client/src/app/admin/[section]/page.tsx` |
| New UI component | `client/src/components/[category]/ComponentName.tsx` |
| New custom hook | `client/src/hooks/useHookName.ts` |
| New Zustand store | `client/src/store/storeName.ts` |
| New TypeScript type | `client/src/types/domain.types.ts` |
| New API route group | `server/src/routes/feature.routes.ts` |
| New controller | `server/src/controllers/feature.controller.ts` |
| New Mongoose model | `server/src/models/ModelName.model.ts` |
| New middleware | `server/src/middleware/name.middleware.ts` |
| New BullMQ job | `server/src/jobs/workers/jobName.worker.ts` |
| New service | `server/src/services/feature.service.ts` |
| New TMDB util | `server/src/services/tmdb.service.ts` (extend) |
| Agent memory doc | `docs/agent_memory/filename.md` |

---

## Key Architectural Boundaries

```
┌─────────────────────────────────────────────────────────┐
│  RULE: client/ and server/ are INDEPENDENT packages.    │
│  - Each has its own package.json                        │
│  - Each has its own node_modules (do NOT share)         │
│  - Each deploys to a DIFFERENT platform                 │
│  - client/ → Vercel                                     │
│  - server/ → Railway or Render                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  RULE: No API routes in client/src/app/api/             │
│  All backend logic lives in server/                     │
│  Next.js API routes are FORBIDDEN in this project       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  RULE: Video files NEVER stored in server/ or MongoDB   │
│  Only embed_url strings are stored (see schema_memory)  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. SRS Compact Monorepo Tree (Quick Reference)

> **Source**: Aptech TechWiz SRS directory design requirements.
> This is the concise canonical tree from the SRS. Sections 1–3 above contain the fully expanded version with all subdirectories and file placements.

```
fan-hub-plus/
├── docs/
│   └── agent_memory/           # AI Context Files
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   ├── components/         # Reusable UI (VideoPlayer, Cards)
│   │   ├── store/              # Zustand Global State
│   │   └── lib/                # API Axios instances & utils
│   └── tailwind.config.js
└── server/                     # Express.js Backend
    ├── src/
    │   ├── controllers/        # Route Logic
    │   ├── models/             # Mongoose Schemas
    │   ├── routes/             # API Endpoints
    │   ├── workers/            # BullMQ Sync Jobs
    │   └── middleware/         # Auth & Error Handling
    └── .env.example
```

### SRS Tree → Full Tree Cross-Reference

| SRS Compact Path              | Full Expanded Path (Sections 1–3)                          |
|-------------------------------|------------------------------------------------------------|
| `client/src/app/`             | All `(auth)/`, `(main)/`, `admin/` route groups            |
| `client/src/components/`      | `ui/`, `layout/`, `content/`, `player/`, `bookmark/`, etc. |
| `client/src/store/`           | `authStore.ts`, `uiStore.ts`, `bookmarkStore.ts`           |
| `client/src/lib/`             | `api.ts`, `auth.ts`, `utils.ts`                            |
| `server/src/controllers/`     | `auth`, `content`, `category`, `bookmark`, `admin`, etc.   |
| `server/src/models/`          | `User`, `Category`, `Content`, `Bookmark`, `Character`     |
| `server/src/routes/`          | `/api/v1/auth`, `/content`, `/categories`, `/admin`, etc.  |
| `server/src/workers/`         | `server/src/jobs/workers/tmdbSync.worker.ts`               |
| `server/src/middleware/`      | `auth`, `admin`, `rateLimiter`, `errorHandler`, `validate` |
| `server/.env.example`         | Documented in full in `technical_standards.md` Section 4.1 |
