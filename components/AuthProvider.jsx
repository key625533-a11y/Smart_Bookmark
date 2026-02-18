'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const AuthContext = createContext({})

// Create client once outside the component
const supabase = createClient()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Essential check for environment variables
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('Supabase credentials missing in environment variables!')
            setLoading(false)
            return
        }

        let mounted = true

        // Definitive timeout: Force loading to false after 1.5s no matter what
        const forceLoadTimeout = setTimeout(() => {
            if (mounted) {
                console.log('AuthProvider: Force clearing loading state (timeout)')
                setLoading(false)
            }
        }, 1500)

        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (mounted) {
                    if (error) console.error('AuthProvider: Session error:', error)
                    setUser(session?.user ?? null)
                    setLoading(false)
                    clearTimeout(forceLoadTimeout)
                }
            } catch (err) {
                if (mounted) {
                    console.error('AuthProvider: Failed to get session:', err)
                    setLoading(false)
                    clearTimeout(forceLoadTimeout)
                }
            }
        }

        // Set up listener FIRST
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null)
                setLoading(false)
                clearTimeout(forceLoadTimeout)
            }
        })

        // Then check session
        checkSession()

        return () => {
            mounted = false
            subscription.unsubscribe()
            clearTimeout(forceLoadTimeout)
        }
    }, [])

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            console.error('Error signing in with Google:', error.message)
            throw error
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error signing out:', error.message)
            throw error
        }
    }

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
