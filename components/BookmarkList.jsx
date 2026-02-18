'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const { user } = useAuth()
    const supabase = createClient()

    useEffect(() => {
        if (!user) return

        // Fetch initial bookmarks
        fetchBookmarks()

        // Set up real-time subscription
        const channel = supabase
            .channel('public-bookmarks-' + user.id)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => {
                            // Prevent duplicates if already added locally
                            if (current.some(b => b.id === payload.new.id)) return current
                            return [payload.new, ...current]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((current) =>
                            current.map((bookmark) =>
                                bookmark.id === payload.new.id ? payload.new : bookmark
                            )
                        )
                    }
                }
            )
            .subscribe()

        // Listen for window focus to re-fetch (catch up on any background changes)
        const handleFocus = () => {
            fetchBookmarks()
        }
        window.addEventListener('focus', handleFocus)

        return () => {
            supabase.removeChannel(channel)
            window.removeEventListener('focus', handleFocus)
        }
    }, [user])

    const fetchBookmarks = async () => {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setBookmarks(data || [])
        } catch (error) {
            console.error('Error fetching bookmarks:', error)
            toast.error('Failed to load bookmarks')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return

        setDeletingId(id)

        try {
            const { error } = await supabase.from('bookmarks').delete().eq('id', id)

            if (error) throw error

            // Update local state immediately for better UX
            setBookmarks((current) => current.filter((b) => b.id !== id))

            toast.success('Bookmark deleted successfully!')
        } catch (error) {
            console.error('Error deleting bookmark:', error)
            toast.error('Failed to delete bookmark')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="h-6 bg-dark-700 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="card text-center py-12">
                <svg
                    className="w-16 h-16 text-dark-600 mx-auto mb-4"
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
                <h3 className="text-xl font-semibold text-dark-400 mb-2">No bookmarks yet</h3>
                <p className="text-dark-500">Add your first bookmark to get started!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg
                    className="w-6 h-6 text-primary-500"
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
                My Bookmarks ({bookmarks.length})
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="card glass-hover group relative overflow-hidden"
                    >
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-primary-400 transition-colors">
                                {bookmark.title}
                            </h3>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-400 hover:text-primary-300 truncate block flex items-center gap-1"
                            >
                                <span className="truncate">{bookmark.url}</span>
                                <svg
                                    className="w-4 h-4 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>

                        <div className="flex items-center justify-between text-xs text-dark-400">
                            <span>
                                {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>

                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                disabled={deletingId === bookmark.id}
                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                {deletingId === bookmark.id ? (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
