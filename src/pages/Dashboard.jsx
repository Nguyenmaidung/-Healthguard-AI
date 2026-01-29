import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, getHealthLogs, getBodyMetricsHistory } from '../lib/supabase'
import {
    Activity,
    Heart,
    Thermometer,
    Moon,
    Scale,
    Stethoscope,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
    const { user, profile, isGuest } = useAuth()
    const [healthLogs, setHealthLogs] = useState([])
    const [bodyMetrics, setBodyMetrics] = useState([])
    const [loading, setLoading] = useState(true)
    const [todayLog, setTodayLog] = useState(null)

    useEffect(() => {
        loadData()
    }, [user, isGuest])

    const loadData = async () => {
        if (isGuest) {
            // Load from localStorage for guest
            const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
            setHealthLogs(guestData.healthLogs || [])
            setBodyMetrics(guestData.bodyMetrics || [])
            setLoading(false)
            return
        }

        if (!user) return

        try {
            const [logs, metrics] = await Promise.all([
                getHealthLogs(user.id, 7),
                getBodyMetricsHistory(user.id, 30)
            ])
            setHealthLogs(logs)
            setBodyMetrics(metrics)

            // Check for today's log
            const today = new Date().toDateString()
            const todayEntry = logs.find(log =>
                new Date(log.recorded_at).toDateString() === today
            )
            setTodayLog(todayEntry)
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const latestMetric = bodyMetrics[bodyMetrics.length - 1]
    const latestLog = healthLogs[healthLogs.length - 1]

    const quickStats = [
        {
            icon: Scale,
            label: 'BMI hiện tại',
            value: latestMetric?.bmi?.toFixed(1) || '--',
            unit: '',
            color: 'primary'
        },
        {
            icon: Heart,
            label: 'Nhịp tim',
            value: latestLog?.heart_rate || '--',
            unit: 'bpm',
            color: 'danger'
        },
        {
            icon: Thermometer,
            label: 'Nhiệt độ',
            value: latestLog?.temperature || '--',
            unit: '°C',
            color: 'warning'
        },
        {
            icon: Moon,
            label: 'Giấc ngủ',
            value: latestLog?.sleep_hours || '--',
            unit: 'giờ',
            color: 'purple'
        }
    ]

    const quickActions = [
        {
            path: '/tracking',
            icon: Activity,
            label: 'Ghi nhận hôm nay',
            description: 'Cập nhật chỉ số sức khỏe',
            color: 'from-primary-500 to-blue-500'
        },
        {
            path: '/symptoms',
            icon: Stethoscope,
            label: 'Phân tích triệu chứng',
            description: 'Tư vấn AI về triệu chứng',
            color: 'from-purple-500 to-pink-500'
        },
        {
            path: '/bmi',
            icon: Scale,
            label: 'Cập nhật cân nặng',
            description: 'Theo dõi BMI của bạn',
            color: 'from-success-500 to-teal-500'
        }
    ]

    // Prepare chart data
    const chartData = healthLogs.map(log => ({
        date: new Date(log.recorded_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        heartRate: log.heart_rate,
        temperature: log.temperature
    }))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Xin chào{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
                        </h1>
                        <p className="text-dark-400">
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    {!todayLog && (
                        <Link to="/tracking" className="btn-primary flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Ghi nhận hôm nay
                        </Link>
                    )}
                    {todayLog && (
                        <div className="flex items-center gap-2 text-success-400 bg-success-500/10 px-4 py-2 rounded-xl border border-success-500/30">
                            <CheckCircle className="w-5 h-5" />
                            <span>Đã ghi nhận hôm nay</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Guest Mode Notice */}
            {isGuest && (
                <div className="glass-card p-4 border-warning-500/30 bg-warning-500/5">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0" />
                        <p className="text-sm text-warning-400">
                            Bạn đang ở chế độ khách. Dữ liệu chỉ lưu trên thiết bị này.
                            <Link to="/register" className="underline ml-1 hover:text-warning-300">
                                Đăng ký để lưu an toàn
                            </Link>
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="glass-card p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                                </div>
                                <span className="text-sm text-dark-400">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{stat.value}</span>
                                <span className="text-sm text-dark-500">{stat.unit}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                        <Link
                            key={index}
                            to={action.path}
                            className="glass-card-hover p-6 group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
                              flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                                {action.label}
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 
                                       transform translate-x-0 group-hover:translate-x-1 
                                       transition-all" />
                            </h3>
                            <p className="text-sm text-dark-400">{action.description}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Charts Section */}
            {chartData.length > 0 && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Xu hướng 7 ngày qua</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="heartRate"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={{ fill: '#ef4444', strokeWidth: 0 }}
                                    name="Nhịp tim"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Health Tips */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">💡 Mẹo sức khỏe hôm nay</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
                        <p className="text-dark-300 text-sm">
                            <strong className="text-primary-400">Uống đủ nước:</strong> Mục tiêu 2-3 lít nước mỗi ngày
                            giúp duy trì năng lượng và hỗ trợ tiêu hóa.
                        </p>
                    </div>
                    <div className="p-4 bg-success-500/10 rounded-xl border border-success-500/20">
                        <p className="text-dark-300 text-sm">
                            <strong className="text-success-400">Vận động:</strong> Chỉ 30 phút đi bộ mỗi ngày
                            có thể giảm nguy cơ bệnh tim mạch đáng kể.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
