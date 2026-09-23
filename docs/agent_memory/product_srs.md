# Fan Hub Plus — Product SRS (Software Requirements Specification)

> **AGENT INSTRUCTION**: This file is canonical. Read it before implementing any feature. Do NOT deviate from constraints without explicit user approval.

---

## 1. Project Overview

| Field        | Value                                              |
|--------------|----------------------------------------------------|
| Product Name | Fan Hub Plus                                       |
| Type         | Dynamic Fandom Information Hub                     |
| Scope        | End-to-end web solution (MERN + Next.js)           |
| Origin       | Aptech TechWiz SRS                                 |

**Goal**: Build a centralized, dynamic platform where fans of various media can discover content, watch embedded media, manage personal dashboards, bookmark favourites, and explore character profiles — all administered through a secure control panel.

---

## 2. User Roles

| Role             | Description                                                                 | Permissions                                                                 |
|------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Visitor**      | Unauthenticated user browsing the platform                                  | Read-only access to public content pages; cannot bookmark or watch premium media |
| **Registered User** | Authenticated member with a personal account                             | Full read access, personalized dashboard, bookmarking, embedded video playback, character profile views |
| **Administrator** | Elevated user managing platform content and users                          | All Registered User permissions + Admin Control Panel access: create/edit/delete content, manage users, manage categories, trigger TMDB sync jobs |

---

## 3. Fandom Categories (Enum — Fixed 8)

These are the only valid category values across the entire application. Do NOT add new categories without updating the Category schema enum.

```
1. Anime
2. Gaming
3. Movies
4. TV Shows
5. K-Pop
6. Comics
7. Manga
8. Cosplay
```

---

## 4. Core Features

### 4.1 User Authentication
- Custom JWT-based login and registration (access token + refresh token strategy).
- Passwords hashed with **bcrypt** (min 12 salt rounds).
- No third-party auth providers (Clerk, Auth0, Firebase Auth, etc.).
- Refresh token rotation: invalidate old token on each refresh.
- Protected routes enforced both on the Next.js middleware layer and Express route guards.

### 4.2 Personalized Dashboard
- Displayed after login.
- Shows: recently viewed content, bookmarked items, recommended content based on `favorite_fandoms`.
- Server-rendered on first load (Next.js App Router + fetch with `no-store` for dynamic data).

### 4.3 Interactive Multimedia Center
- Embedded video streaming via third-party CDN iframes (VidSrc, Doodstream, etc.).
- Audio content supported via embed URLs.
- Custom video player UI built in React with `<Suspense>` boundary (CSR).
- No `.mp4` files stored in the database or on the server.
- `embed_url` field in the Content schema drives all playback.

### 4.4 Bookmarking
- Registered users can bookmark any Content document.
- Bookmark stores a reference to the User and the Content item.
- Dashboard displays bookmarks grouped by category.

### 4.5 Character Profiles
- Static-ish pages for characters linked to Content items.
- Rendered with **ISR** (Incremental Static Regeneration) since character data changes infrequently.
- Contains: character name, description, associated media, image URL.

### 4.6 Admin Control Panel
- Accessible only to users with `role: "admin"`.
- Features:
  - Content CRUD (create, edit, soft-delete Content documents).
  - User management (view, role change, ban/unban).
  - Category management (activate/deactivate categories).
  - Trigger TMDB metadata sync jobs manually.
  - View BullMQ job queue status.

---

## 5. Non-Functional Requirements

| Requirement       | Constraint                                                          |
|-------------------|---------------------------------------------------------------------|
| Performance       | ISR revalidation ≤ 3600s for metadata pages; CSR only for player   |
| Storage Budget    | Zero video storage cost — all video served via third-party embeds  |
| Scalability       | MongoDB Atlas free tier compatible; horizontal scaling via Atlas    |
| Security          | JWT secrets in env vars; CORS restricted to known origins          |
| Accessibility     | WCAG 2.1 AA compliance target for public-facing pages              |

---

## 6. Out of Scope (Current Phase)

- Real-time chat or community features.
- Native mobile apps (iOS/Android).
- Payment/subscription gating.
- Third-party CMS (Sanity, Contentful, etc.).
- Social OAuth (Google, GitHub login).
