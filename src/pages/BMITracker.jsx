import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addBodyMetrics, getBodyMetricsHistory } from '../lib/supabase'
import {
    calculateBMI,
    getBMICategory,
    getIdealWeightRange,
    analyzeBMITrend,
    getBMIRecommendations
} from '../lib/ai/bmiAnalysis'
import {
    Scale,
    Ruler,
    TrendingUp,
    TrendingDown,
    Minus,
    Save,
    Loader2,
    Check,
    AlertTriangle,
    Info
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function BMITracker() {
    const { user, profile, isGuest } = useAuth()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [bodyMetrics, setBodyMetrics] = useState([])
    const [formData, setFormData] = useState({
        weight_kg: '',
        height_cm: profile?.height_cm || ''
    })

    useEffect(() => {
        if (profile?.height_cm) {
            setFormData(prev => ({ ...prev, height_cm: profile.height_cm }))
        }
        loadBodyMetrics()
    }, [user, profile, isGuest])

    const loadBodyMetrics = async () => {
        if (isGuest) {
            const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
            setBodyMetrics(guestData.bodyMetrics || [])
            return
        }

        if (!user) return

        try {
            const metrics = await getBodyMetricsHistory(user.id, 90)
            setBodyMetrics(metrics)
        } catch (error) {
            console.error('Error loading body metrics:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.weight_kg || !formData.height_cm) return

        setLoading(true)

        try {
            const bmi = calculateBMI(parseFloat(formData.weight_kg), parseFloat(formData.height_cm))

            if (isGuest) {
                const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
                guestData.bodyMetrics = [
                    ...(guestData.bodyMetrics || []),
                    {
                        id: Date.now(),
                        weight_kg: parseFloat(formData.weight_kg),
                        height_cm: parseFloat(formData.height_cm),
                        bmi,
                        recorded_at: new Date().toISOString()
                    }
                ]
                localStorage.setItem('healthguard_guest_data', JSON.stringify(guestData))
                setBodyMetrics(guestData.bodyMetrics)
            } else {
                await addBodyMetrics(user.id, {
                    weight_kg: parseFloat(formData.weight_kg),
                    height_cm: parseFloat(formData.height_cm)
                })
                await loadBodyMetrics()
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            setFormData(prev => ({ ...prev, weight_kg: '' }))
        } catch (error) {
            console.error('Error saving body metrics:', error)
        } finally {
            setLoading(false)
        }
    }

    // Current calculations
    const currentBMI = formData.weight_kg && formData.height_cm
        ? calculateBMI(parseFloat(formData.weight_kg), parseFloat(formData.height_cm))
        : bodyMetrics.length > 0
            ? bodyMetrics[bodyMetrics.length - 1].bmi
            : null

    const bmiCategory = getBMICategory(currentBMI)
    const idealRange = getIdealWeightRange(parseFloat(formData.height_cm) || profile?.height_cm)
    const trendAnalysis = analyzeBMITrend(bodyMetrics)
    const recommendations = getBMIRecommendations(currentBMI)

    // Chart data
    const chartData = bodyMetrics.map(m => ({
        date: new Date(m.recorded_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        weight: m.weight_kg,
        bmi: m.bmi
    }))

    const getBMIColorClass = () => {
        if (!bmiCategory) return 'text-dark-400'
        if (bmiCategory.color === 'success') return 'text-success-400'
        if (bmiCategory.color === 'warning') return 'text-warning-400'
        return 'text-danger-400'
    }

    const getBMIBgClass = () => {
        if (!bmiCategory) return 'bg-dark-500/20'
        if (bmiCategory.color === 'success') return 'bg-success-500/20'
        if (bmiCategory.color === 'warning') return 'bg-warning-500/20'
        return 'bg-danger-500/20'
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-500 to-teal-500 flex items-center justify-center">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">BMI & Cân nặng</h1>
                        <p className="text-dark-400">Theo dõi chỉ số khối cơ thể và xu hướng cân nặng</p>
                    </div>
                </div>
            </div>

            {/* Current BMI Display */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">BMI hiện tại</h2>

                    <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getBMIBgClass()} mb-4`}>
                            <span className={`text-4xl font-bold ${getBMIColorClass()}`}>
                                {currentBMI?.toFixed(1) || '--'}
                            </span>
                        </div>

                        {bmiCategory && (
                            <div className={`inline-block px-4 py-2 rounded-full ${getBMIBgClass()} ${getBMIColorClass()} font-medium`}>
                                {bmiCategory.label}
                            </div>
                        )}

                        {/* BMI Scale */}
                        <div className="mt-6">
                            <div className="flex h-3 rounded-full overflow-hidden">
                                <div className="flex-1 bg-danger-500" title="Thiếu cân"></div>
                                <div className="flex-1 bg-success-500" title="Bình thường"></div>
                                <div className="flex-1 bg-warning-500" title="Thừa cân"></div>
                                <div className="flex-1 bg-danger-500" title="Béo phì"></div>
                            </div>
                            <div className="flex justify-between text-xs text-dark-500 mt-1">
                                <span>16</span>
                                <span>18.5</span>
                                <span>25</span>
                                <span>30</span>
                                <span>40</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weight Entry Form */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Cập nhật cân nặng</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                                <Ruler className="w-4 h-4" />
                                Chiều cao (cm)
                            </label>
                            <input
                                type="number"
                                value={formData.height_cm}
                                onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                                className="input-field"
                                placeholder="170"
                                min="50"
                                max="250"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-2">
                                <Scale className="w-4 h-4" />
                                Cân nặng (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.weight_kg}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                                className="input-field"
                                placeholder="65"
                                min="20"
                                max="300"
                                required
                            />
                        </div>

                        {idealRange && (
                            <div className="p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
                                <p className="text-sm text-dark-300">
                                    <Info className="w-4 h-4 inline mr-1 text-primary-400" />
                                    Cân nặng lý tưởng: <span className="text-primary-400 font-medium">{idealRange.min} - {idealRange.max} kg</span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : saved ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Đã lưu!
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Lưu cân nặng
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Trend Analysis */}
            {trendAnalysis && trendAnalysis.trend !== 'insufficient_data' && (
                <div className={`glass-card p-6 ${trendAnalysis.alertLevel === 'high' ? 'border-danger-500/30 bg-danger-500/5' :
                        trendAnalysis.alertLevel === 'medium' ? 'border-warning-500/30 bg-warning-500/5' :
                            'border-success-500/30 bg-success-500/5'
                    }`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${trendAnalysis.alertLevel === 'high' ? 'bg-danger-500/20' :
                                trendAnalysis.alertLevel === 'medium' ? 'bg-warning-500/20' :
                                    'bg-success-500/20'
                            }`}>
                            {trendAnalysis.trend.includes('increase') ? (
                                <TrendingUp className={`w-6 h-6 ${trendAnalysis.alertLevel === 'high' ? 'text-danger-400' : 'text-warning-400'
                                    }`} />
                            ) : trendAnalysis.trend.includes('decrease') ? (
                                <TrendingDown className={`w-6 h-6 ${trendAnalysis.alertLevel === 'high' ? 'text-danger-400' : 'text-warning-400'
                                    }`} />
                            ) : (
                                <Minus className="w-6 h-6 text-success-400" />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-semibold mb-2 ${trendAnalysis.alertLevel === 'high' ? 'text-danger-400' :
                                    trendAnalysis.alertLevel === 'medium' ? 'text-warning-400' :
                                        'text-success-400'
                                }`}>
                                {trendAnalysis.message}
                            </h3>
                            <ul className="text-sm text-dark-300 space-y-1">
                                {trendAnalysis.recommendations.map((rec, i) => (
                                    <li key={i}>• {rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Weight Chart */}
            {chartData.length > 0 && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Biểu đồ cân nặng & BMI</h2>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#weightGradient)"
                                    name="Cân nặng (kg)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">💡 Lời khuyên</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                                <Check className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
                                <p className="text-dark-300 text-sm">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
