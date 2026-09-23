# Fan Hub Plus — Schema Memory (Database Blueprints)

> **AGENT INSTRUCTION**: These are the canonical Mongoose schema blueprints. Do NOT redefine schemas in ad-hoc ways. When implementing, translate these JSON blueprints directly into Mongoose Schema definitions in `/server/src/models/`.

---

## 1. Enumerations (Shared Constants)

```json
{
  "FANDOM_CATEGORIES": [
    "Anime",
    "Gaming",
    "Movies",
    "TV Shows",
    "K-Pop",
    "Comics",
    "Manga",
    "Cosplay"
  ],
  "USER_ROLES": ["visitor", "user", "admin"],
  "CONTENT_TYPES": ["movie", "tv_show", "anime", "music_video", "short", "other"]
}
```

---

## 2. User Schema

**Collection**: `users`

```json
{
  "schema_name": "User",
  "collection": "users",
  "fields": {
    "_id": {
      "type": "ObjectId",
      "auto": true,
      "description": "MongoDB auto-generated primary key"
    },
    "username": {
      "type": "String",
      "required": true,
      "unique": true,
      "trim": true,
      "minLength": 3,
      "maxLength": 30,
      "match": "^[a-zA-Z0-9_]+$",
      "description": "Alphanumeric username, no spaces"
    },
    "email": {
      "type": "String",
      "required": true,
      "unique": true,
      "lowercase": true,
      "trim": true,
      "description": "User email — indexed and unique"
    },
    "password_hash": {
      "type": "String",
      "required": true,
      "select": false,
      "description": "bcrypt hash. Never returned in queries by default (select: false)"
    },
    "role": {
      "type": "String",
      "enum": ["visitor", "user", "admin"],
      "default": "user",
      "description": "Access control role"
    },
    "avatar_url": {
      "type": "String",
      "default": null,
      "description": "URL to avatar image (external CDN URL, not stored locally)"
    },
    "favorite_fandoms": {
      "type": ["String"],
      "enum": ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"],
      "default": [],
      "description": "User's preferred categories — drives dashboard recommendations"
    },
    "is_banned": {
      "type": "Boolean",
      "default": false,
      "description": "Admin can ban users. Banned users cannot login."
    },
    "refresh_token": {
      "type": "String",
      "default": null,
      "select": false,
      "description": "Current valid refresh token hash. Rotated on each refresh. Null on logout."
    },
    "last_login": {
      "type": "Date",
      "default": null,
      "description": "Timestamp of last successful login"
    }
  },
  "timestamps": true,
  "indexes": [
    { "field": "email", "options": { "unique": true } },
    { "field": "username", "options": { "unique": true } },
    { "field": "role", "options": {} }
  ],
  "virtuals": {
    "bookmarks": {
      "ref": "Bookmark",
      "localField": "_id",
      "foreignField": "user_id",
      "justOne": false,
      "description": "Virtual populate — not stored in document"
    }
  }
}
```

---

## 3. Category Schema

**Collection**: `categories`

```json
{
  "schema_name": "Category",
  "collection": "categories",
  "description": "Static-ish configuration documents for each of the 8 fandoms. Allows admin to toggle visibility and add metadata.",
  "fields": {
    "_id": {
      "type": "ObjectId",
      "auto": true
    },
    "name": {
      "type": "String",
      "required": true,
      "unique": true,
      "enum": ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"],
      "description": "Must match the FANDOM_CATEGORIES enum exactly"
    },
    "slug": {
      "type": "String",
      "required": true,
      "unique": true,
      "lowercase": true,
      "description": "URL-safe slug: e.g. 'tv-shows', 'k-pop'. Used in Next.js dynamic routes /category/[slug]"
    },
    "description": {
      "type": "String",
      "maxLength": 500,
      "default": "",
      "description": "Short description displayed on category landing page"
    },
    "banner_url": {
      "type": "String",
      "default": null,
      "description": "Hero banner image URL for the category page"
    },
    "icon_url": {
      "type": "String",
      "default": null,
      "description": "Small icon/logo for sidebar and cards"
    },
    "is_active": {
      "type": "Boolean",
      "default": true,
      "description": "Admin can deactivate a category. Deactivated categories are hidden from the UI."
    },
    "display_order": {
      "type": "Number",
      "default": 0,
      "description": "Controls render order in the navigation and category grid"
    }
  },
  "timestamps": true,
  "indexes": [
    { "field": "slug", "options": { "unique": true } },
    { "field": "is_active", "options": {} }
  ]
}
```

---

## 4. Content Schema

**Collection**: `contents`

> **UPDATED**: `tmdb_id` remains the deduplication key. The previous single `embed_url` / `embed_source` fields have been **replaced** by a `streams` array (multi-language, multi-CDN) and a `subtitles` array (WebVTT tracks). See SRS Streaming Structure section below.

```json
{
  "schema_name": "Content",
  "collection": "contents",
  "description": "Core content documents. Metadata fetched from TMDB. Video served via streams[].embed_url (iframes). Supports multi-language audio, multiple CDN fallbacks, and dynamic WebVTT subtitles. No binary video storage.",
  "fields": {
    "_id": {
      "type": "ObjectId",
      "auto": true
    },
    "tmdb_id": {
      "type": "Number",
      "required": true,
      "unique": true,
      "description": "TMDB database ID. Unique index prevents duplicate fetches. Used to construct VidSrc embed URLs automatically."
    },
    "title": {
      "type": "String",
      "required": true,
      "trim": true,
      "maxLength": 300,
      "description": "Content title from TMDB"
    },
    "original_title": {
      "type": "String",
      "default": null,
      "description": "Original language title (e.g., Japanese title for anime)"
    },
    "overview": {
      "type": "String",
      "default": "",
      "maxLength": 2000,
      "description": "Synopsis/description from TMDB"
    },
    "category": {
      "type": "String",
      "required": true,
      "enum": ["Anime", "Gaming", "Movies", "TV Shows", "K-Pop", "Comics", "Manga", "Cosplay"],
      "description": "Which fandom this content belongs to"
    },
    "content_type": {
      "type": "String",
      "enum": ["movie", "tv_show", "anime", "music_video", "short", "other"],
      "default": "other",
      "description": "Specific media type within the category"
    },
    "poster_path": {
      "type": "String",
      "default": null,
      "description": "TMDB poster path (relative). Construct full URL with NEXT_PUBLIC_TMDB_IMAGE_BASE + poster_path"
    },
    "backdrop_path": {
      "type": "String",
      "default": null,
      "description": "TMDB backdrop path (relative). For hero banners."
    },
    "release_date": {
      "type": "Date",
      "default": null,
      "description": "Release / air date from TMDB"
    },
    "genres": {
      "type": ["String"],
      "default": [],
      "description": "Genre names from TMDB (e.g., ['Action', 'Fantasy'])"
    },
    "vote_average": {
      "type": "Number",
      "default": 0,
      "min": 0,
      "max": 10,
      "description": "TMDB rating score"
    },
    "popularity": {
      "type": "Number",
      "default": 0,
      "description": "TMDB popularity score — used for trending sort"
    },
    "streams": {
      "type": "Array of Objects",
      "default": [],
      "description": "Multi-language audio streams and multi-CDN server fallbacks. Each object represents one playable source.",
      "schema": {
        "language": {
          "type": "String",
          "required": true,
          "description": "Audio language label (e.g., English, Japanese, Hindi Dubbed, Korean)"
        },
        "quality": {
          "type": "String",
          "enum": ["360p", "480p", "720p", "1080p", "4K", "auto"],
          "default": "auto",
          "description": "Stream quality label shown in the player UI"
        },
        "server_name": {
          "type": "String",
          "required": true,
          "description": "CDN provider identifier (e.g., VidSrc, Doodstream, StreamTape). Used for player server-switcher UI and CSP allow-listing."
        },
        "embed_url": {
          "type": "String",
          "required": true,
          "description": "Full iframe src URL for this stream. Admin-supplied. Never fetched from TMDB. If this URL fails, the player falls back to the next stream object in the array."
        }
      },
      "notes": "Array ordered by preference — index 0 is the default stream loaded on page open. Player UI must expose a server/language switcher iterating this array. Minimum 1 stream required for is_published to be set true."
    },
    "subtitles": {
      "type": "Array of Objects",
      "default": [],
      "description": "Dynamic subtitle tracks fetched via OpenSubtitles API or manually added by admin. Rendered as WebVTT cue tracks inside the player.",
      "schema": {
        "language": {
          "type": "String",
          "required": true,
          "description": "Subtitle language label (e.g., English, Arabic, French, Spanish)"
        },
        "vtt_url": {
          "type": "String",
          "required": true,
          "description": "Publicly accessible URL to the .vtt (WebVTT) subtitle file. Must be HTTPS and CORS-accessible."
        }
      },
      "notes": "VTT URLs must be CORS-accessible for the browser to load them as track elements. OpenSubtitles API is the primary source; admin can also manually paste VTT URLs."
    },
    "trailer_url": {
      "type": "String",
      "default": null,
      "description": "YouTube trailer embed URL (optional, for preview before full video)"
    },
    "characters": {
      "type": ["ObjectId"],
      "ref": "Character",
      "default": [],
      "description": "References to Character documents associated with this content"
    },
    "is_published": {
      "type": "Boolean",
      "default": false,
      "description": "Admin must explicitly publish. Unpublished content invisible to non-admin users. Requires at least one valid streams entry."
    },
    "is_featured": {
      "type": "Boolean",
      "default": false,
      "description": "Featured content appears in hero carousel on homepage/dashboard"
    },
    "tmdb_synced_at": {
      "type": "Date",
      "default": null,
      "description": "Last time TMDB data was fetched/updated for this document"
    },
    "created_by": {
      "type": "ObjectId",
      "ref": "User",
      "default": null,
      "description": "Admin user who triggered the sync or created the entry"
    }
  },
  "timestamps": true,
  "indexes": [
    { "field": "tmdb_id", "options": { "unique": true } },
    { "field": "category", "options": {} },
    { "field": "is_published", "options": {} },
    { "field": "is_featured", "options": {} },
    { "field": "popularity", "options": { "sort": -1 } },
    { "compound": ["category", "is_published"], "options": {} }
  ]
}
```

---

### SRS Streaming Structure (Canonical Compact Reference)

> **Source**: Aptech TechWiz SRS — multi-language audio stream and dynamic subtitle requirements.

```json
{
  "Content": {
    "fields": [
      "content_id (PK)",
      "tmdb_id (Unique, for deduplication)",
      "category_id (FK)",
      "title",
      "type",
      "poster_url",
      "streams (Array of Objects): [{ language: String, quality: String, server_name: String, embed_url: String }]",
      "subtitles (Array of Objects): [{ language: String, vtt_url: String }]"
    ],
    "relations": "Many-to-One with Category, One-to-Many with Bookmark",
    "notes": "The 'streams' array handles dubbed versions and multiple CDN fallbacks (e.g., VidSrc, Doodstream). The 'subtitles' array stores .vtt subtitle files fetched via OpenSubtitles API."
  }
}
```

### streams Array — Example Document

```json
{
  "streams": [
    { "language": "English",      "quality": "1080p", "server_name": "VidSrc",     "embed_url": "https://vidsrc.to/embed/movie/550" },
    { "language": "Japanese",     "quality": "720p",  "server_name": "Doodstream", "embed_url": "https://doodstream.com/e/abc123" },
    { "language": "Hindi Dubbed", "quality": "480p",  "server_name": "StreamTape", "embed_url": "https://streamtape.com/e/xyz789" }
  ]
}
```

### subtitles Array — Example Document

```json
{
  "subtitles": [
    { "language": "English", "vtt_url": "https://cdn.opensubtitles.com/subtitles/en/movie-550.vtt" },
    { "language": "Arabic",  "vtt_url": "https://cdn.opensubtitles.com/subtitles/ar/movie-550.vtt" },
    { "language": "French",  "vtt_url": "https://cdn.opensubtitles.com/subtitles/fr/movie-550.vtt" }
  ]
}
```

### Player Behaviour Rules (derived from schema)

| Rule | Detail |
|---|---|
| Default stream | Always load `streams[0]` on page open |
| Server switcher | Player UI renders dropdown/button group iterating `streams` array |
| Language switcher | Filter `streams` by `language` field; show distinct language options |
| CDN fallback | If `streams[0]` fails (10s onLoad timeout), auto-advance to `streams[1]`, etc. |
| Subtitle track | Inject each `subtitles[n].vtt_url` as a `<track kind="subtitles">` element |
| Publish guard | `is_published` cannot be `true` if `streams` array is empty |
| CSP | Every unique `server_name` domain must be whitelisted in `next.config.js` `frame-src` |

---

## 5. Bookmark Schema

**Collection**: `bookmarks`

```json
{
  "schema_name": "Bookmark",
  "collection": "bookmarks",
  "description": "Many-to-many relationship between Users and Content. One document per bookmark action.",
  "fields": {
    "_id": {
      "type": "ObjectId",
      "auto": true
    },
    "user_id": {
      "type": "ObjectId",
      "ref": "User",
      "required": true,
      "description": "The user who bookmarked the content"
    },
    "content_id": {
      "type": "ObjectId",
      "ref": "Content",
      "required": true,
      "description": "The content that was bookmarked"
    },
    "note": {
      "type": "String",
      "maxLength": 300,
      "default": "",
      "description": "Optional personal note the user can attach to a bookmark"
    }
  },
  "timestamps": true,
  "indexes": [
    {
      "compound": ["user_id", "content_id"],
      "options": { "unique": true },
      "description": "Prevents duplicate bookmarks. Use as upsert key."
    },
    { "field": "user_id", "options": {} },
    { "field": "content_id", "options": {} }
  ]
}
```

---

## 6. Character Schema (Supplementary)

**Collection**: `characters`

```json
{
  "schema_name": "Character",
  "collection": "characters",
  "description": "Character profiles linked to Content. Pages rendered with ISR.",
  "fields": {
    "_id": { "type": "ObjectId", "auto": true },
    "name": { "type": "String", "required": true, "trim": true },
    "description": { "type": "String", "maxLength": 2000, "default": "" },
    "image_url": { "type": "String", "default": null },
    "content_id": {
      "type": "ObjectId",
      "ref": "Content",
      "required": true,
      "description": "The media this character belongs to"
    },
    "aliases": { "type": ["String"], "default": [] },
    "abilities": { "type": ["String"], "default": [] },
    "is_published": { "type": "Boolean", "default": false }
  },
  "timestamps": true,
  "indexes": [
    { "field": "content_id", "options": {} },
    { "field": "name", "options": {} }
  ]
}
```

---

## 7. Schema Relationships Diagram

```
User (1) ──────────────────── (many) Bookmark
                                         │
Content (1) ─────────────────────────────┘
  │
  └─── (many) Character
```

```
Category ◄─── (category field: String enum) ─── Content
```

> **Note**: Category is referenced as a String enum in Content, not as an ObjectId ref. This simplifies queries and avoids unnecessary population. Category documents store display metadata (banner, icon, slug) but content filtering uses the string enum directly.

---

## 8. SRS Entity-Relationship Summary (Compact Reference)

> **Source**: Aptech TechWiz SRS database design requirements.
> Use this compact view for quick relationship lookups. For full field specs and Mongoose options, refer to Sections 2–6 above.

```json
{
  "User": {
    "fields": [
      "user_id (PK)",
      "name",
      "email",
      "password_hash",
      "role",
      "favorite_fandoms"
    ],
    "relations": "One-to-Many with Bookmark, One-to-Many with Feedback"
  },
  "Category": {
    "fields": [
      "category_id (PK)",
      "name (Enum: Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, Cosplay)",
      "description"
    ],
    "relations": "One-to-Many with Content"
  },
  "Content": {
    "fields": [
      "content_id (PK)",
      "tmdb_id (Unique)",
      "category_id (FK)",
      "title",
      "type",
      "embed_url",
      "poster_url"
    ],
    "relations": "Many-to-One with Category, One-to-Many with Bookmark"
  },
  "Bookmark": {
    "fields": [
      "bookmark_id (PK)",
      "user_id (FK)",
      "content_id (FK)",
      "note"
    ],
    "relations": "Compound Unique Index on (user_id, content_id)"
  }
}
```

### Relation Map (Visual)

```
User    ──< Bookmark >── Content ──> Category
User    ──< Feedback
Content ──< Bookmark
```

| Relation                     | Type         | Key                                    |
|------------------------------|--------------|----------------------------------------|
| User → Bookmark              | One-to-Many  | `Bookmark.user_id` FK → `User._id`    |
| Content → Bookmark           | One-to-Many  | `Bookmark.content_id` FK → `Content._id` |
| Bookmark unique constraint   | Compound     | `(user_id, content_id)` unique index   |
| Category → Content           | One-to-Many  | `Content.category_id` FK → `Category._id` |
| Content → Category           | Many-to-One  | `Content.category_id`                  |
| User → Feedback              | One-to-Many  | `Feedback.user_id` FK → `User._id`    |
