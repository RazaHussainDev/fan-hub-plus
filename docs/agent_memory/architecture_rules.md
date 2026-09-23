# Fan Hub Plus — Architecture Rules

> **AGENT INSTRUCTION**: This file defines hard technical boundaries. Every architectural decision MUST comply with the rules below. Violations require explicit user override.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│           Next.js 14+ (App Router) — Deployed on Vercel         │
│  ISR: Category/Character pages  │  CSR/Suspense: Video Player   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS REST API calls
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│        Express.js + Node.js — Deployed on Railway / Render      │
│  Routes │ Controllers │ Middleware │ BullMQ Workers             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│                      MongoDB Atlas                               │
│        Users │ Categories │ Content │ Bookmarks                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Rules (Next.js)

| Rule | Detail |
|------|--------|
| Framework | **Next.js 14+** — App Router ONLY. Do NOT use the Pages Router. |
| Deployment | **Vercel** — use `vercel.json` for custom headers/rewrites if needed. |
| Rendering — Metadata pages | **ISR** (`revalidate: 3600`): Category listing, Character profiles, Content detail pages |
| Rendering — Dashboard | **Dynamic** (`fetch` with `cache: 'no-store'`): personalized user data must never be cached |
| Rendering — Video Player | **CSR with `<Suspense>`**: wrap the player component in a Suspense boundary with a skeleton fallback; use `'use client'` directive |
| Styling | Tailwind CSS (utility-first). No inline `style` props in JSX. |
| State Management | Zustand for global client state (auth token, UI state). React Query / TanStack Query for server state. |
| API Calls | All calls to the Express backend go through a single `lib/api.ts` Axios instance with interceptors for JWT refresh. |
| Environment Variables | `NEXT_PUBLIC_*` only for non-secret client-side vars. All secrets stay server-side only. |
| Forbidden | ❌ Clerk, Auth0, NextAuth, or any third-party auth SDK. ❌ Sanity or any external CMS SDK. ❌ Storing .mp4 file paths. |

---

## 3. Backend Rules (Express.js + Node.js)

| Rule | Detail |
|------|--------|
| Framework | **Express.js** on **Node.js 20 LTS** |
| Deployment | **Railway** or **Render** (dedicated long-running process — avoids Vercel serverless 10s timeout). Choose Railway for free PostgreSQL add-on availability; Render for zero-sleep free tier. |
| API Style | RESTful JSON API. Version all routes under `/api/v1/`. |
| Authentication | Custom **JWT** implementation using `jsonwebtoken` package. Two tokens: `accessToken` (15m expiry) + `refreshToken` (7d expiry, stored in HttpOnly cookie). |
| Password Security | `bcrypt` with **minimum 12 salt rounds**. |
| Middleware Stack | `helmet` (security headers), `cors` (allowlist Vercel domain), `express-rate-limit` (100 req/15min per IP), `morgan` (logging), `express-validator` (input validation). |
| Background Jobs | **BullMQ** with **Redis** (Railway Redis add-on or Upstash free tier) for TMDB sync jobs. Workers run in the same Node.js process (separate worker file). |
| Database ODM | **Mongoose 8+** for MongoDB Atlas. All schemas defined in `/server/src/models/`. |
| Error Handling | Centralised async error handler middleware. All route handlers use `asyncHandler` wrapper. |
| Forbidden | ❌ Vercel deployment for the backend. ❌ Any serverless function patterns. ❌ Storing video binary data. |

---

## 4. Database Rules (MongoDB Atlas)

| Rule | Detail |
|------|--------|
| Provider | **MongoDB Atlas** — Free M0 cluster (512 MB). |
| ODM | Mongoose with strict schema validation. |
| Deduplication | `Content.tmdb_id` must be **unique indexed** to prevent duplicate TMDB entries. |
| Video Storage | Store only `embed_url` (iframe src string). Never store video files or base64 blobs. |
| Indexing | Index: `Content.category`, `Content.tmdb_id`, `Bookmark.user_id`, `User.email` (unique). |
| Backups | Atlas automated backups enabled. Point-in-time recovery if on M10+ (upgrade path). |
| Forbidden | ❌ Storing `.mp4`, `.webm`, or any binary video/audio data. ❌ Sanity dataset IDs or external CMS references. |

---

## 5. Authentication Rules (JWT)

```
Access Token:  HS256, 15 minute expiry, payload: { userId, role, email }
Refresh Token: HS256, 7 day expiry, stored in HttpOnly Secure SameSite=Strict cookie
Refresh Flow:  POST /api/v1/auth/refresh → validate refresh token → issue new access token + rotate refresh token
Logout:        DELETE /api/v1/auth/logout → clear HttpOnly cookie on server
```

- JWT secrets stored in `.env` as `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- **Never** expose JWT secrets to the client or commit to version control.
- Admin routes additionally check `req.user.role === 'admin'` after JWT verification.

---

## 6. Streaming Strategy (Zero-Budget Compliance)

```
RULE: The application MUST NOT incur video storage costs.

Flow:
1. Admin triggers a TMDB sync job (or it runs on schedule via BullMQ cron).
2. BullMQ Worker fetches metadata from TMDB API (title, poster, description, tmdb_id).
3. Worker saves/updates the Content document in MongoDB (upsert on tmdb_id).
4. Admin separately provides embed_url (e.g., VidSrc iframe URL) for the content.
5. Frontend renders the embed_url inside an <iframe> inside the CSR Suspense player.

Allowed embed sources (examples — admin decides):
  - VidSrc:     https://vidsrc.to/embed/movie/{tmdb_id}
  - Doodstream: https://doodstream.com/e/{video_id}
  - StreamTape: https://streamtape.com/e/{video_id}

The Next.js next.config.js MUST whitelist these iframe domains in Content Security Policy.
```

---

## 7. Environment Variables Reference

### `/client/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
```

### `/server/.env`
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/fanhubplus
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-random-secret>
TMDB_API_KEY=<your-tmdb-api-key>
REDIS_URL=redis://default:<pass>@<host>:<port>
CLIENT_ORIGIN=https://fanhubplus.vercel.app
```

---

## 8. Deployment Checklist (Reference)

- [ ] Vercel project linked to `/client` subdirectory
- [ ] Railway project linked to `/server` subdirectory, `npm start` build command
- [ ] MongoDB Atlas IP whitelist includes Railway egress IPs (or use 0.0.0.0/0 for MVP)
- [ ] Redis instance provisioned (Railway plugin or Upstash)
- [ ] All env vars set in Vercel dashboard and Railway dashboard
- [ ] CSP headers configured in `next.config.js` for iframe embed domains
- [ ] CORS on Express set to `CLIENT_ORIGIN` env var only
