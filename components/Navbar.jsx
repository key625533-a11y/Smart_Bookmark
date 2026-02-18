'use client'

import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
    const { user, signOut } = useAuth()

    return (
        <nav className="glass border-b border-dark-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                            Smart Bookmark
                        </h1>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full ring-2 ring-primary-500"
                                    />
                                )}
                                <span className="text-sm text-dark-300">{user.email}</span>
                            </div>
                            <button onClick={signOut} className="btn-secondary text-sm">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
