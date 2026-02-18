'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import toast from 'react-hot-toast'

export default function AddBookmarkForm({ onBookmarkAdded }) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const supabase = createClient()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!url || !title) {
            toast.error('Please fill in all fields')
            return
        }

        // Basic URL validation
        try {
            new URL(url)
        } catch {
            toast.error('Please enter a valid URL')
            return
        }

        setLoading(true)

        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .insert([
                    {
                        user_id: user.id,
                        title: title.trim(),
                        url: url.trim(),
                    },
                ])
                .select()

            if (error) throw error

            toast.success('Bookmark added successfully!')
            setUrl('')
            setTitle('')
            if (onBookmarkAdded) onBookmarkAdded()
        } catch (error) {
            console.error('Error adding bookmark:', error)
            toast.error('Failed to add bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
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
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                Add New Bookmark
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-dark-300 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter bookmark title"
                        className="input-field"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-dark-300 mb-2">
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="input-field"
                        disabled={loading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                            Adding...
                        </span>
                    ) : (
                        'Add Bookmark'
                    )}
                </button>
            </form>
        </div>
    )
}
