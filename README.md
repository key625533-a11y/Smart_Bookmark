# Smart Bookmark App

A modern bookmark manager with real-time synchronization built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 **Google OAuth authentication** - Secure sign-in with Google
- 📚 **Real-time sync** - Bookmarks update instantly across all tabs
- 🔒 **Private bookmarks** - Each user sees only their own bookmarks
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast** - Built with Next.js 15 for optimal performance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Real-time**: Supabase Realtime

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!



## How It Works

### Real-time Synchronization
Bookmarks sync automatically across all your devices and browser tabs. Add a bookmark on your phone, and it instantly appears on your laptop!

### Privacy & Security
Your bookmarks are completely private. Row Level Security (RLS) ensures you can only see your own bookmarks.

### Google Authentication
Sign in securely with your Google account - no passwords to remember!




## Challenges Faced & Solutions

### 1. Authentication Redirect to Localhost on Vercel
**Problem**: After deploying to Vercel, signing in with Google would often redirect the user back to `localhost:3000` instead of the production Vercel URL, causing a "Site cannot be reached" error.

**Solution**: This was identified as a configuration mismatch between the app's environment and the authorized redirect URIs in Supabase and Google Cloud Console.
- **Supabase**: Updated the **Site URL** and **Redirect URLs** in the Supabase Auth settings to match the Vercel deployment URL (`https://smart-bookmark-steel-nine.vercel.app`).
- **Google Cloud**: Ensured the **Authorized redirect URIs** included the Supabase project callback URL (`https://tqxiobugnyhbrgertarw.supabase.co/auth/v1/callback`).

### 2. Duplicate Real-time Updates
**Problem**: When adding a bookmark, the UI would sometimes show the same bookmark twice—once from the local optimistic update and once from the real-time Supabase subscription.

**Solution**: Implemented a check in the real-time subscription listener to see if the incoming bookmark ID already exists in the local state. This ensures that the UI only reflects the change once, keeping the list clean and accurate.

### 3. Stale Data on Window Focus
**Problem**: If a user left the app open in a background tab for a long time, the real-time connection could sometimes drop, leading to stale data when they returned to the app.

**Solution**: Added a `window` focus event listener that triggers a fresh fetch of the bookmarks whenever the user returns to the tab. This acts as a "catch-up" mechanism to ensure the UI is always up to date.
