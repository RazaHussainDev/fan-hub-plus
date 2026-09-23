# Fan Hub Plus — Flow Memory (System Logic)

> **AGENT INSTRUCTION**: Use these diagrams as the canonical reference for user journey logic and TMDB sync architecture. Do NOT implement flows that contradict these diagrams.

---

## 1. User Journey Flowchart

Maps the complete user lifecycle from first visit to bookmarking content.

```mermaid
flowchart TD
    A([🌐 Visitor Lands on Homepage]) --> B{Is User\nAuthenticated?}

    B -- No --> C[View Public Content\nISR-rendered category pages]
    B -- Yes --> D[Personalized Dashboard\nDynamic fetch, no-store]

    C --> E{User wants\nfull access?}
    E -- No --> C
    E -- Yes --> F[Navigate to /register]

    F --> G[Fill Registration Form\nusername, email, password]
    G --> H{Validation\nPasses?}
    H -- No --> I[Show Field Errors] --> G
    H -- Yes --> J[POST /api/v1/auth/register\nExpress Backend]
    J --> K[bcrypt hash password\nCreate User in MongoDB]
    K --> L[Issue Access Token + Refresh Token\nSet HttpOnly Cookie]
    L --> D

    D --> M[Browse Favourite Fandoms\nBased on favorite_fandoms array]
    D --> N[View Bookmarks Section]
    D --> O[View Recently Viewed]

    M --> P[Navigate to Category Page\ne.g., /category/anime]
    P --> Q[Browse Content Grid\nISR page with content list]
    Q --> R[Click on Content Card]

    R --> S[Content Detail Page\n/content/slug]
    S --> T{Has embed_url?}
    T -- No --> U[Show Trailer Only\nor Coming Soon state]
    T -- Yes --> V[Load CSR Video Player\nSuspense boundary with skeleton]
    V --> W[Render iframe with embed_url\nVidSrc / Doodstream]
    W --> X[🎬 User Watches Embedded Video]

    X --> Y{User wants to\nsave content?}
    Y -- No --> Q
    Y -- Yes --> Z{User logged in?}
    Z -- No --> F
    Z -- Yes --> AA[Click Bookmark Button]
    AA --> AB[POST /api/v1/bookmarks\nSend content_id]
    AB --> AC[Upsert Bookmark in MongoDB\nuser_id + content_id unique index]
    AC --> AD[✅ Bookmark Saved\nUpdate Dashboard Bookmarks]
    AD --> D

    style A fill:#6366f1,color:#fff
    style D fill:#10b981,color:#fff
    style X fill:#f59e0b,color:#fff
    style AD fill:#10b981,color:#fff
    style I fill:#ef4444,color:#fff
    style U fill:#6b7280,color:#fff
```

---

## 2. TMDB Metadata Fetching Sequence Diagram

Shows the background job pipeline that fetches content metadata from TMDB **without involving the Next.js frontend**.

```mermaid
sequenceDiagram
    actor Admin as 👤 Admin User
    participant FE as Next.js Frontend<br/>(Vercel)
    participant BE as Express Backend<br/>(Railway/Render)
    participant Queue as BullMQ Queue<br/>(Redis)
    participant Worker as BullMQ Worker<br/>(Node.js Process)
    participant TMDB as TMDB API<br/>(External)
    participant DB as MongoDB Atlas

    Note over FE,DB: ⚠️ TMDB sync BYPASSES the Next.js frontend entirely

    Admin->>FE: Clicks "Sync TMDB" button\nin Admin Control Panel
    FE->>BE: POST /api/v1/admin/jobs/tmdb-sync\n{ tmdb_id, category, content_type }
    BE->>BE: Verify JWT + role === 'admin'
    BE->>Queue: Add job to 'tmdb-sync' queue\n{ tmdb_id, category, content_type }
    BE-->>FE: 202 Accepted\n{ jobId: "job_abc123" }
    FE-->>Admin: "Sync job queued ✓"\nShow job status polling

    Note over Queue,Worker: BullMQ processes job asynchronously

    Queue->>Worker: Dequeue job { tmdb_id, category }
    Worker->>TMDB: GET /movie/{tmdb_id}?api_key=KEY\nor GET /tv/{tmdb_id}?api_key=KEY
    TMDB-->>Worker: 200 OK\n{ title, overview, poster_path,\n  backdrop_path, genres,\n  vote_average, release_date, ... }

    Worker->>Worker: Transform TMDB response\nto Content schema shape

    Worker->>DB: findOneAndUpdate(\n  { tmdb_id },\n  { $set: transformedData },\n  { upsert: true }\n)
    DB-->>Worker: Upserted / Updated document

    Worker->>Queue: Mark job as COMPLETED
    Queue->>BE: Job completion event (optional webhook)
    BE->>DB: Update job log record\n{ status: 'completed', synced_at: now }

    Note over Admin,FE: Admin polls for job status
    Admin->>FE: Checks job status
    FE->>BE: GET /api/v1/admin/jobs/job_abc123
    BE->>Queue: Check BullMQ job state
    Queue-->>BE: { state: 'completed' }
    BE-->>FE: { status: 'completed', tmdb_id }
    FE-->>Admin: ✅ "Metadata synced successfully"\nContent now visible in Admin panel

    Note over Admin,DB: Admin then manually sets embed_url
    Admin->>FE: Edit Content\nPaste embed_url (VidSrc/Doodstream)
    FE->>BE: PATCH /api/v1/admin/content/{id}\n{ embed_url, embed_source }
    BE->>DB: Update Content document\n{ embed_url, embed_source, is_published: true }
    DB-->>BE: Updated document
    BE-->>FE: 200 OK
    FE-->>Admin: ✅ "Content published with embed URL"
```

---

## 3. Authentication Flow Diagram

```mermaid
sequenceDiagram
    actor User
    participant FE as Next.js Client
    participant BE as Express Backend
    participant DB as MongoDB

    User->>FE: Submit login form\n{ email, password }
    FE->>BE: POST /api/v1/auth/login
    BE->>DB: findOne({ email }).select('+password_hash')
    DB-->>BE: User document
    BE->>BE: bcrypt.compare(password, hash)

    alt Password invalid or user banned
        BE-->>FE: 401 Unauthorized
        FE-->>User: Show error message
    else Valid credentials
        BE->>BE: Sign accessToken (15m)\nSign refreshToken (7d)
        BE->>DB: Update user.refresh_token = hash(refreshToken)
        BE-->>FE: 200 OK\n{ accessToken }\nSet-Cookie: refreshToken (HttpOnly)
        FE->>FE: Store accessToken in Zustand\n(memory only, NOT localStorage)
        FE-->>User: Redirect to /dashboard
    end

    Note over FE,BE: On access token expiry (401 response)
    FE->>BE: POST /api/v1/auth/refresh\n(Cookie: refreshToken sent automatically)
    BE->>DB: Verify refresh token hash
    BE->>BE: Issue new accessToken\nRotate refreshToken
    BE->>DB: Update refresh_token hash
    BE-->>FE: 200 OK { accessToken }\nSet new refreshToken cookie
    FE->>FE: Retry original request\nwith new accessToken
```

---

## 4. Admin Content Management Flow

```mermaid
flowchart LR
    A([Admin Login]) --> B[Admin Control Panel\n/admin]
    B --> C{Action?}

    C --> D[Content Management]
    C --> E[User Management]
    C --> F[Category Management]
    C --> G[Job Queue Monitor]

    D --> D1[Trigger TMDB Sync\nEnter tmdb_id + category]
    D1 --> D2[BullMQ Job Created]
    D2 --> D3[Worker fetches metadata]
    D3 --> D4[Content upserted in DB]
    D4 --> D5[Admin adds embed_url]
    D5 --> D6[Admin publishes content\nis_published = true]

    E --> E1[View all users]
    E1 --> E2{User action?}
    E2 --> E3[Change role\nuser ↔ admin]
    E2 --> E4[Ban/Unban user\nis_banned toggle]

    F --> F1[Toggle is_active]
    F --> F2[Update banner/icon URLs]
    F --> F3[Reorder display_order]

    G --> G1[View pending jobs]
    G --> G2[View completed jobs]
    G --> G3[View failed jobs\nRetry option]

    style A fill:#6366f1,color:#fff
    style D6 fill:#10b981,color:#fff
```

---

## 5. SRS Compact Diagrams (Quick Reference)

> **Source**: Aptech TechWiz SRS system logic specification.
> These are the concise canonical diagrams from the SRS. Sections 1–4 above contain the full extended versions.

### A. User Journey (Next.js Client)

```mermaid
graph TD
    A[Visitor Landing Page] --> B{Action}
    B -->|Register/Login| C[Personalized Dashboard]
    B -->|Browse| D[Category Explorer]
    C --> D
    D --> E[Interactive Multimedia Center]
    E --> F[Watch Video via iframe embed_url]
    F --> G[Add to Bookmarks]
```

### B. TMDB Sync & Streaming Architecture (Express Server)

```mermaid
sequenceDiagram
    participant BullMQ as Background Worker
    participant TMDB as TMDB API
    participant DB as MongoDB Atlas
    participant Client as Next.js Frontend
    participant CDN as VidSrc/Doodstream CDN

    BullMQ->>TMDB: Fetch latest movie/anime data
    TMDB-->>BullMQ: Return JSON metadata
    BullMQ->>DB: Upsert (prevent duplicates via tmdb_id)
    Client->>DB: Request Content
    DB-->>Client: Return Metadata & embed_url
    Client->>CDN: Load Video in iframe (embed_url)
    CDN-->>Client: Stream Video directly (Zero bandwidth on origin)
```

> **Key insight from diagram B**: The Next.js frontend never contacts TMDB directly.
> All metadata flows through the Express BullMQ worker → MongoDB Atlas pipeline.
> Video bandwidth is entirely offloaded to the third-party CDN — zero origin streaming cost.
