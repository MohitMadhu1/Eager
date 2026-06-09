# EagerMinds Take-Home — Bookmarks App

A personal bookmarks app ("linktree meets pocket") built with Next.js + Supabase, deployed on Vercel.

---

## Phase 0 — Prerequisites & Account Setup (COMPLETED ✅)
- [x] Entire CLI installed and session recording active
- [x] Supabase project created, URL & Anon Key stored in `.env.local`
- [x] Resend API key generated and stored in `.env.local`

---

## Tech Stack & Design

| Layer | Choice |
|---|---|
| Framework | **Next.js 14 (App Router)** - TypeScript, SSR/RSC |
| Auth + DB | **Supabase** (Auth, Postgres, and Storage for images) |
| Email | **Resend** (Custom confirmation emails) |
| Styling | **Vanilla CSS Modules** (Premium, modern design with glassmorphism, micro-animations, and a cohesive color palette) |

---

## Database Schema (Supabase)

### `profiles` table
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
handle      text UNIQUE NOT NULL       -- @handle for public profile
avatar_url  text                       -- URL for their profile picture
created_at  timestamptz DEFAULT now()
```

### `bookmarks` table
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
title       text NOT NULL
url         text NOT NULL
is_public   boolean NOT NULL DEFAULT false
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

> [!CAUTION]
> **Row Level Security (RLS) Policies:**
> - `profiles`: Publicly readable (powers the search feature and public pages). Users can only insert/update/delete their own row.
> - `bookmarks`: Publicly readable ONLY IF `is_public = true`. Users can read/write their own rows regardless of privacy.
> - **Storage Bucket:** Public bucket called `avatars`. Users can upload files only if authenticated.

---

## Core Workflows

### 1. The Sign-Up Flow
1. User enters Email & Password on `/signup`.
2. Supabase creates the unverified user. We trigger a custom Resend email saying "Confirm your account".
3. User clicks link in email -> hits our `/api/auth/confirm` route -> logs them in.
4. User is redirected to `/onboarding`.
5. User picks a `@handle` AND optionally uploads a profile picture.
6. User saves -> `profiles` row is created -> redirected to `/dashboard`.

### 2. Dashboard (Protected)
- If a user tries to access `/dashboard` without a `profiles` row, they are kicked back to `/onboarding`.
- Users can CRUD bookmarks, toggle public/private.

### 3. Public Profile & Search
- **Search:** A global search bar on the landing page (`/`) where users can search for handles (e.g., typing "moh" shows `@mohit`).
- **Profile (`/<handle>`):** Server-side rendered page displaying their `avatar_url`, `@handle`, and public bookmarks.

---

## Proposed Execution Plan

1. **Scaffold Next.js** — Run `create-next-app`
2. **Global Styles** — Set up a premium CSS design system
3. **Supabase Client** — Configure `@supabase/ssr`
4. **Auth & Onboarding** — Build the Signup -> Confirm -> Handle + Image flow
5. **Dashboard** — Build Bookmark CRUD
6. **Public View & Search** — Build `/<handle>` and the profile search bar
7. **Database RLS** — Apply SQL policies in Supabase
8. **Deploy to Vercel** — Verify everything works live
