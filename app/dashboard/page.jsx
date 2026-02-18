'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'

export default function Dashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [refreshKey, setRefreshKey] = useState(0)

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1)
    }

    useEffect(() => {
        if (!loading && !user) {
            router.push('/')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-dark-300">Loading your bookmarks...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                        Your Bookmarks
                    </h1>
                    <p className="text-dark-300">
                        Manage and organize your bookmarks with real-time synchronization
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add bookmark form - sticky on larger screens */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-8">
                            <AddBookmarkForm onBookmarkAdded={handleRefresh} />
                        </div>
                    </div>

                    {/* Bookmarks list */}
                    <div className="lg:col-span-2">
                        <BookmarkList key={refreshKey} />
                    </div>
                </div>

                {/* Real-time indicator */}
                <div className="fixed bottom-4 right-4 bg-dark-800 border border-primary-500 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-dark-300">Real-time sync active</span>
                </div>
            </main>
        </div>
    )
}
