# EagerMinds - Take-Home Assignment

![EagerMinds Overview](https://eager-delta.vercel.app/)

A robust, production-ready full-stack application built for the EagerMinds take-home assignment. It allows users to save links privately, claim a unique handle, and curate a public profile to share their favorite bookmarks with the world.

### Live Demo
👉 **[https://eager-delta.vercel.app/](https://eager-delta.vercel.app/)**

> **🚨 IMPORTANT NOTE FOR REVIEWERS (Resend Sandbox)**
> Because this is deployed on a free Resend tier, the email API is in Sandbox mode and will *only* send emails to my verified email address. 
> To allow you to seamlessly test the signup flow without getting blocked, I built a Master OTP backdoor.
> 
> **How to test:** Sign up with any fake email (e.g., `test@example.com`). When prompted for the verification code, simply type **`000000`**. You will instantly bypass the email check and be securely logged in!

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS (Glassmorphism, Dark Theme, Custom Variables)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase SSR Auth (Custom OTP Flow)
- **Email:** Resend Node.js SDK
- **Deployment:** Vercel

---

## ✨ Features Implemented

1. **Complete Authentication & Onboarding**
   - Secure Sign Up, Log In, and Log Out using Next.js Server Actions and Middleware.
   - A dedicated onboarding flow forcing users to claim a unique `@handle` before accessing the app.

2. **Custom OTP Architecture**
   - Bypassed default Supabase email handling to avoid rate-limits.
   - Built a custom 6-digit OTP verification system utilizing the Resend SDK and a `custom_otps` database table.

3. **Bookmark Dashboard (CRUD)**
   - Add new bookmarks with a URL, Title, and Description.
   - Inline Editing for quick updates.
   - Toggle links instantly between **Public** and **Private**.

4. **Public Profiles & Global Search**
   - Dynamic routing (`/[handle]`) allows anyone to view a user's curated public bookmarks.
   - Inline Global Search powered by Supabase `.ilike()` to instantly find users or public links.

5. **Premium UI/UX**
   - Designed a beautiful, responsive dark-mode interface inspired by Twitter/X and Linktree.
   - Implemented glassmorphic cards, CSS grid backgrounds, and SVG micro-interactions without relying on heavy UI libraries.

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
