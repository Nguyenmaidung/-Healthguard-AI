import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper function to get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

// Helper function to get user profile
export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

// Helper function to update user profile
export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single()

    if (error) throw error
    return data
}

// Helper function to add body metrics
export const addBodyMetrics = async (userId, metrics) => {
    const bmi = metrics.weight_kg / Math.pow(metrics.height_cm / 100, 2)

    const { data, error } = await supabase
        .from('body_metrics')
        .insert({
            user_id: userId,
            weight_kg: metrics.weight_kg,
            height_cm: metrics.height_cm,
            bmi: Math.round(bmi * 10) / 10
        })
        .select()
        .single()

    if (error) throw error
    return data
}

// Helper function to get body metrics history
export const getBodyMetricsHistory = async (userId, days = 30) => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true })

    if (error) throw error
    return data || []
}

// Helper function to add health log
export const addHealthLog = async (userId, log) => {
    const { data, error } = await supabase
        .from('health_logs')
        .insert({
            user_id: userId,
            ...log
        })
        .select()
        .single()

    if (error) throw error
    return data
}

// Helper function to get health logs
export const getHealthLogs = async (userId, days = 7) => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('health_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true })

    if (error) throw error
    return data || []
}

// Helper function to add symptom log
export const addSymptomLog = async (userId, log) => {
    const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
            user_id: userId,
            ...log
        })
        .select()
        .single()

    if (error) throw error
    return data
}

// Helper function to get symptom logs
export const getSymptomLogs = async (userId, limit = 10) => {
    const { data, error } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data || []
}
