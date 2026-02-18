'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
    const { user, loading, signInWithGoogle } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user && !loading) {
            router.push('/dashboard')
        }
    }, [user, loading, router])

    const handleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            console.error('Sign in error:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-2xl text-primary-400">Loading...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto animate-fade-in">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
                        Smart Bookmark
                    </h1>
                    <p className="text-xl md:text-2xl text-dark-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Your bookmarks, everywhere, in real-time
                    </p>
                </div>

                <div className="glass rounded-2xl p-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white">Get Started</h2>
                        <p className="text-dark-300">
                            Sign in with Google to start managing your bookmarks with real-time synchronization across all your devices.
                        </p>
                    </div>

                    <button
                        onClick={handleSignIn}
                        className="w-full btn-primary flex items-center justify-center gap-3 group"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-lg font-semibold">Continue with Google</span>
                    </button>

                    <div className="pt-4 border-t border-dark-700 space-y-2">
                        <h3 className="text-sm font-semibold text-primary-400">Features</h3>
                        <ul className="text-sm text-dark-300 space-y-2 text-left">
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Real-time synchronization across devices
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Private and secure bookmarks
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Simple and intuitive interface
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}
