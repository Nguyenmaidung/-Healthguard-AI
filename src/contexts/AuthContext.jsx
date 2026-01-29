import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserProfile, updateUserProfile } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isGuest, setIsGuest] = useState(false)

    useEffect(() => {
        // Check for guest mode
        const guestMode = localStorage.getItem('healthguard_guest_mode')
        if (guestMode === 'true') {
            setIsGuest(true)
            setLoading(false)
            return
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    await loadProfile(session.user.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const loadProfile = async (userId) => {
        try {
            const data = await getUserProfile(userId)
            setProfile(data)
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        })
        if (error) throw error
        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        return data
    }

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        })
        if (error) throw error
        return data
    }

    const signOut = async () => {
        if (isGuest) {
            localStorage.removeItem('healthguard_guest_mode')
            localStorage.removeItem('healthguard_guest_data')
            setIsGuest(false)
            return
        }

        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const enableGuestMode = () => {
        localStorage.setItem('healthguard_guest_mode', 'true')
        localStorage.setItem('healthguard_guest_data', JSON.stringify({
            profile: {},
            bodyMetrics: [],
            healthLogs: [],
            symptomLogs: []
        }))
        setIsGuest(true)
    }

    const updateProfile = async (updates) => {
        if (isGuest) {
            const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
            guestData.profile = { ...guestData.profile, ...updates }
            localStorage.setItem('healthguard_guest_data', JSON.stringify(guestData))
            setProfile(guestData.profile)
            return guestData.profile
        }

        const data = await updateUserProfile(user.id, updates)
        setProfile(data)
        return data
    }

    const acceptDisclaimer = async () => {
        return await updateProfile({
            disclaimer_accepted: true,
            disclaimer_accepted_at: new Date().toISOString()
        })
    }

    const deleteAccount = async () => {
        if (isGuest) {
            localStorage.removeItem('healthguard_guest_mode')
            localStorage.removeItem('healthguard_guest_data')
            setIsGuest(false)
            return
        }

        // Delete all user data first
        const userId = user.id
        await supabase.from('symptom_logs').delete().eq('user_id', userId)
        await supabase.from('health_logs').delete().eq('user_id', userId)
        await supabase.from('body_metrics').delete().eq('user_id', userId)
        await supabase.from('profiles').delete().eq('id', userId)

        // Sign out
        await signOut()
    }

    const value = {
        user,
        profile,
        loading,
        isGuest,
        isAuthenticated: !!user || isGuest,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        enableGuestMode,
        updateProfile,
        acceptDisclaimer,
        deleteAccount,
        refreshProfile: () => user && loadProfile(user.id)
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
