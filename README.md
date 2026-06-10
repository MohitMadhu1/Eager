# EagerMinds - Take-Home Assignment

A robust, production-ready full-stack application built for the EagerMinds take-home assignment. It allows users to save links privately, claim a unique handle, and curate a public profile to share their favorite bookmarks with the world.

### Live Demo
👉 **[View Live Deployment](https://eager-jrxi7v38n-mohitmadhu1s-projects.vercel.app)** *(Replace with your actual Vercel domain if different)*

> **🚨 CRITICAL NOTE FOR REVIEWERS: HOW TO LOG IN (MASTER OTP)**
> Because this is deployed on a free Resend tier, the email API is in Sandbox mode and will *only* deliver real emails to my verified developer address. 
> To allow you to seamlessly test the signup flow without getting blocked, I built a custom authentication backdoor:
> 
> **👉 Sign up with any fake email (e.g., `test@example.com`). When prompted for the verification code, simply type `000000`. You will instantly bypass the email check and be securely logged in!**

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS (Minimalist B&W Theme, CSS Grid)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase SSR Auth (Custom OTP Flow)
- **Email:** Resend Node.js SDK
- **Web Scraping:** Cheerio (for OpenGraph link previews)
- **Animations:** React-Three-Fiber / Three.js (React Bits WebGL Background)
- **Deployment:** Vercel

---

## ✨ Features Implemented

1. **Complete Authentication & Onboarding**
   - Secure Sign Up, Log In, and Log Out using Next.js Server Actions and Middleware.
   - A dedicated onboarding flow forcing users to claim a unique `@handle` and optionally upload a profile picture.

2. **Custom OTP Architecture**
   - Bypassed default Supabase email handling to avoid rate-limits.
   - Built a custom 6-digit OTP verification system utilizing the Resend SDK and a custom database table.

3. **Bookmark Dashboard (CRUD)**
   - Inline Editing for quick updates.
   - Toggle links instantly between **Public** and **Private**.
   - **Automated Link Previews:** Dropping a raw URL automatically scrapes the destination site for `og:image`, `og:title`, and `og:description` to render beautiful preview cards.

4. **Public Profiles & Global Search**
   - Dynamic routing (`/[handle]`) allows anyone to view a user's curated public bookmarks.
   - **Debounced Real-Time Search:** A custom Client Component search bar that dynamically filters users and public links in real-time as you type, syncing with Server Components via URL parameters.

5. **Social Features**
   - A robust Upvote/Like system utilizing a junction database table and RLS policies to prevent duplicate likes.

6. **Premium UI/UX**
   - An ultra-premium, high-contrast Black & White aesthetic.
   - Integrated the **React Bits `<Beams />` 3D WebGL component** for a stunning, interactive landing page background.

---

## 📖 AI Agent Documentation

To ensure total transparency regarding the thought process and architecture decisions made during this take-home assignment, please review the following logs in the root of this repository:

1. **[`AGENT_SESSION.md`](./AGENT_SESSION.md)**: The complete, unsummarized, chronological chat log and specific technical file modifications executed by the AI Agent.
2. **[`AGENT_MISTAKES.md`](./AGENT_MISTAKES.md)**: A transparent record of architectural oversights or bugs the AI introduced during development, and the specific steps we took collaboratively to debug and resolve them.

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohitMadhu1/Eager.git
   cd Eager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
