# AI Agent Debugging & Course Corrections

During the development of this project, working with the AI agent was a highly iterative and collaborative process. While the agent was exceptionally fast at bootstrapping the Next.js App Router, configuring Supabase SSR, and writing CSS, it occasionally made architectural oversights or introduced bugs that required course correction. 

Here is a transparent record of where the agent went wrong and how those issues were resolved:

---

## 1. The Resend Sandbox Blockage
**What went wrong:** 
The agent initially implemented standard Supabase Auth email confirmations using the Resend API. However, the agent failed to account for the fact that the free tier of Resend operates in "Sandbox Mode," which strictly blocks sending emails to any unverified email addresses. This meant no one could sign up to test the app.

**How we fixed it:** 
When the emails failed to deliver, we completely pivoted the architecture. I directed the agent to build a custom OTP (One Time Password) verification system. We bypassed the native Supabase email handler and created a custom `custom_otps` table. More importantly, we introduced a **Master OTP (`000000`)** backdoor so that evaluators could instantly bypass the Sandbox restriction without waiting for real emails.

## 2. The Invisible Avatar CSS Bug
**What went wrong:** 
When we upgraded the platform from the initial dark theme to the premium Black & White minimalist aesthetic, the agent failed to update the fallback styling for user avatars. It had originally used a CSS `background-image` to render profile pictures. If a user didn't have a picture, it fell back to displaying the first letter of their handle in white text—which was now placed on a white background, rendering it invisible.

**How we fixed it:** 
The agent debugged the DOM, realized the color clash, and completely rewrote the avatar rendering logic across the entire platform (`Dashboard`, `Explore`, and `Public Profiles`). It replaced the CSS backgrounds with robust HTML `<img>` tags, ensuring the fallback letter now correctly displays in black text.

## 3. The Supabase Storage RLS Failure
**What went wrong:** 
When implementing the profile picture upload feature, the agent wrote the frontend upload logic but failed to initially instruct me to create the underlying `avatars` Storage Bucket in Supabase. Because the bucket didn't exist, the uploads silently failed, and the database recorded `null` for the `avatar_url`.

**How we fixed it:** 
The agent recognized the missing `avatar_url` payloads and deduced the bucket issue. It quickly wrote a raw SQL script for me to execute in the Supabase SQL Editor, which manually created the bucket and applied the necessary Row Level Security (RLS) policies for `SELECT` and `INSERT`.

## 4. The Vercel Deployment Crash (TypeScript Strictness)
**What went wrong:** 
During development, the agent created a `scratch/` directory containing quick, untyped `.ts` scripts to manually check the database and seed mock data. When I pushed the repository to Vercel, the deployment failed with `Exit Code: 1`. The agent didn't realize that Next.js runs strict TypeScript compiler checks (`tsc`) across the *entire* codebase during a production build, causing it to fail on the temporary scripts.

**How we fixed it:** 
I notified the agent of the failed build. The agent ran `npm run build` locally, reproduced the TypeScript errors inside the `scratch/check_db.ts` file, and immediately deleted the entire `scratch/` directory. The subsequent Vercel redeployment succeeded perfectly.

## 5. Server Actions Binding Error
**What went wrong:** 
When abstracting the Search bar into a debounced Client Component, the agent caused a cascading TypeScript error in the global feed. By mixing Client and Server components, the inline `toggleLike.bind(null, b.id)` Server Action no longer matched React's strict expected signature for action props.

**How we fixed it:** 
The agent ran a local build, caught the Type error, and patched it by explicitly casting the bound function (`as () => void`) in `explore/page.tsx` and `[handle]/page.tsx`, satisfying the compiler.
