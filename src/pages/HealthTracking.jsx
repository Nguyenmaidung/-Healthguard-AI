import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addHealthLog, getHealthLogs } from '../lib/supabase'
import {
    Activity,
    Thermometer,
    Heart,
    Wind,
    Moon,
    Footprints,
    Battery,
    Smile,
    Save,
    Loader2,
    Check,
    Calendar
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const moodOptions = [
    { value: 'great', label: '😄 Tuyệt vời', color: 'success' },
    { value: 'good', label: '🙂 Tốt', color: 'primary' },
    { value: 'normal', label: '😐 Bình thường', color: 'warning' },
    { value: 'bad', label: '😔 Không tốt', color: 'danger' },
    { value: 'terrible', label: '😞 Rất tệ', color: 'danger' }
]

export default function HealthTracking() {
    const { user, isGuest } = useAuth()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [healthLogs, setHealthLogs] = useState([])
    const [viewMode, setViewMode] = useState('7') // 7, 30 days
    const [formData, setFormData] = useState({
        temperature: '',
        heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        sleep_hours: '',
        activity_minutes: '',
        fatigue_level: 5,
        mood: 'normal',
        notes: ''
    })

    useEffect(() => {
        loadHealthLogs()
    }, [user, isGuest, viewMode])

    const loadHealthLogs = async () => {
        if (isGuest) {
            const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
            setHealthLogs(guestData.healthLogs || [])
            return
        }

        if (!user) return

        try {
            const logs = await getHealthLogs(user.id, parseInt(viewMode))
            setHealthLogs(logs)
        } catch (error) {
            console.error('Error loading health logs:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const logData = {
            temperature: parseFloat(formData.temperature) || null,
            heart_rate: parseInt(formData.heart_rate) || null,
            blood_pressure_systolic: parseInt(formData.blood_pressure_systolic) || null,
            blood_pressure_diastolic: parseInt(formData.blood_pressure_diastolic) || null,
            sleep_hours: parseFloat(formData.sleep_hours) || null,
            activity_minutes: parseInt(formData.activity_minutes) || null,
            fatigue_level: formData.fatigue_level,
            mood: formData.mood,
            notes: formData.notes
        }

        try {
            if (isGuest) {
                const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
                guestData.healthLogs = [
                    ...(guestData.healthLogs || []),
                    { ...logData, id: Date.now(), recorded_at: new Date().toISOString() }
                ]
                localStorage.setItem('healthguard_guest_data', JSON.stringify(guestData))
                setHealthLogs(guestData.healthLogs)
            } else {
                await addHealthLog(user.id, logData)
                await loadHealthLogs()
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

            // Reset form
            setFormData({
                temperature: '',
                heart_rate: '',
                blood_pressure_systolic: '',
                blood_pressure_diastolic: '',
                sleep_hours: '',
                activity_minutes: '',
                fatigue_level: 5,
                mood: 'normal',
                notes: ''
            })
        } catch (error) {
            console.error('Error saving health log:', error)
        } finally {
            setLoading(false)
        }
    }

    // Prepare chart data
    const chartData = healthLogs.map(log => ({
        date: new Date(log.recorded_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        heartRate: log.heart_rate,
        temperature: log.temperature,
        sleepHours: log.sleep_hours,
        activityMinutes: log.activity_minutes
    }))

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Theo dõi sức khỏe hàng ngày</h1>
                        <p className="text-dark-400">Ghi nhận các chỉ số sức khỏe của bạn</p>
                    </div>
                </div>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleSubmit} className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    Ghi nhận hôm nay - {new Date().toLocaleDateString('vi-VN')}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Temperature */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-warning-400" />
                            Nhiệt độ (°C)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.temperature}
                            onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                            className="input-field"
                            placeholder="36.5"
                            min="35"
                            max="42"
                        />
                    </div>

                    {/* Heart Rate */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-danger-400" />
                            Nhịp tim (bpm)
                        </label>
                        <input
                            type="number"
                            value={formData.heart_rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, heart_rate: e.target.value }))}
                            className="input-field"
                            placeholder="75"
                            min="40"
                            max="200"
                        />
                    </div>

                    {/* Blood Pressure */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Wind className="w-4 h-4 text-primary-400" />
                            Huyết áp (mmHg)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={formData.blood_pressure_systolic}
                                onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_systolic: e.target.value }))}
                                className="input-field flex-1"
                                placeholder="120"
                                min="70"
                                max="200"
                            />
                            <span className="text-dark-500 self-center">/</span>
                            <input
                                type="number"
                                value={formData.blood_pressure_diastolic}
                                onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_diastolic: e.target.value }))}
                                className="input-field flex-1"
                                placeholder="80"
                                min="40"
                                max="130"
                            />
                        </div>
                    </div>

                    {/* Sleep */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Moon className="w-4 h-4 text-purple-400" />
                            Giấc ngủ (giờ)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={formData.sleep_hours}
                            onChange={(e) => setFormData(prev => ({ ...prev, sleep_hours: e.target.value }))}
                            className="input-field"
                            placeholder="7.5"
                            min="0"
                            max="24"
                        />
                    </div>

                    {/* Activity */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Footprints className="w-4 h-4 text-success-400" />
                            Hoạt động (phút)
                        </label>
                        <input
                            type="number"
                            value={formData.activity_minutes}
                            onChange={(e) => setFormData(prev => ({ ...prev, activity_minutes: e.target.value }))}
                            className="input-field"
                            placeholder="30"
                            min="0"
                            max="480"
                        />
                    </div>

                    {/* Fatigue Level */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                            <Battery className="w-4 h-4 text-warning-400" />
                            Mức độ mệt mỏi: {formData.fatigue_level}/10
                        </label>
                        <input
                            type="range"
                            value={formData.fatigue_level}
                            onChange={(e) => setFormData(prev => ({ ...prev, fatigue_level: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-warning-500"
                            min="1"
                            max="10"
                        />
                        <div className="flex justify-between text-xs text-dark-500 mt-1">
                            <span>Khỏe khoắn</span>
                            <span>Rất mệt</span>
                        </div>
                    </div>
                </div>

                {/* Mood */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                        <Smile className="w-4 h-4 text-primary-400" />
                        Tâm trạng
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {moodOptions.map((mood) => (
                            <button
                                key={mood.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                                className={`px-4 py-2 rounded-xl text-sm transition-all ${formData.mood === mood.value
                                        ? `bg-${mood.color}-500/20 text-${mood.color}-400 border border-${mood.color}-500/30`
                                        : 'bg-white/5 text-dark-400 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                        Ghi chú thêm
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="input-field min-h-[100px]"
                        placeholder="Triệu chứng đặc biệt, thuốc đã uống, hoạt động..."
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary mt-6 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang lưu...
                        </>
                    ) : saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Đã lưu thành công!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Lưu ghi nhận
                        </>
                    )}
                </button>
            </form>

            {/* Charts */}
            {chartData.length > 0 && (
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Biểu đồ theo dõi</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('7')}
                                className={`px-4 py-2 rounded-xl text-sm ${viewMode === '7'
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'bg-white/5 text-dark-400 hover:bg-white/10'
                                    }`}
                            >
                                7 ngày
                            </button>
                            <button
                                onClick={() => setViewMode('30')}
                                className={`px-4 py-2 rounded-xl text-sm ${viewMode === '30'
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'bg-white/5 text-dark-400 hover:bg-white/10'
                                    }`}
                            >
                                30 ngày
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Heart Rate Chart */}
                        <div>
                            <h3 className="text-sm text-dark-400 mb-2">Nhịp tim (bpm)</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        />
                                        <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Nhịp tim" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Sleep Chart */}
                        <div>
                            <h3 className="text-sm text-dark-400 mb-2">Giấc ngủ (giờ)</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="sleepHours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Giấc ngủ" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
