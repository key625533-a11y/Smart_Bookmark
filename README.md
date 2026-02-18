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

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings** > **API**
4. Copy your **Project URL** and **anon key**

### 3. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database

See the `SUPABASE_SETUP.md` file for detailed database setup instructions.

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
4. In Supabase: **Authentication** > **Providers** > Enable Google
5. Add your Google Client ID and Secret

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!
5. Update OAuth redirect URLs with your production URL

## How It Works

### Real-time Synchronization
Bookmarks sync automatically across all your devices and browser tabs. Add a bookmark on your phone, and it instantly appears on your laptop!

### Privacy & Security
Your bookmarks are completely private. Row Level Security (RLS) ensures you can only see your own bookmarks.

### Google Authentication
Sign in securely with your Google account - no passwords to remember!

## Project Structure

```
app/
├── auth/callback/      # OAuth callback handler
├── dashboard/          # Main dashboard page
├── globals.css         # Global styles
├── layout.js          # Root layout
└── page.js            # Landing page

components/
├── AddBookmarkForm.jsx  # Add bookmark form
├── AuthProvider.jsx     # Authentication context
├── BookmarkList.jsx     # Bookmark list with real-time
└── Navbar.jsx          # Navigation bar

lib/
├── supabase.js         # Supabase browser client
└── supabase-server.js  # Supabase server client
```

## License

MIT
