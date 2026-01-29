import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addSymptomLog } from '../lib/supabase'
import {
    analyzeSymptoms,
    getFollowUpQuestions,
    detectSymptomCategory
} from '../lib/ai/symptomRules'
import {
    Stethoscope,
    Send,
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    RefreshCw,
    User,
    Bot,
    Clock,
    Pill,
    Hospital
} from 'lucide-react'

export default function SymptomAssistant() {
    const { user, isGuest } = useAuth()
    const [step, setStep] = useState('input') // input, questions, result
    const [symptoms, setSymptoms] = useState('')
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSymptomSubmit = (e) => {
        e.preventDefault()
        if (!symptoms.trim()) return

        // Get follow-up questions
        const followUpQuestions = getFollowUpQuestions(symptoms)

        if (followUpQuestions.length > 0) {
            setQuestions(followUpQuestions)
            setStep('questions')
        } else {
            // If no specific questions, go directly to analysis
            performAnalysis([])
        }
    }

    const handleAnswerSubmit = (e) => {
        e.preventDefault()
        const newAnswers = [...answers, currentAnswer]
        setAnswers(newAnswers)
        setCurrentAnswer('')

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            performAnalysis(newAnswers)
        }
    }

    const performAnalysis = async (userAnswers) => {
        setLoading(true)
        setStep('result')

        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const result = analyzeSymptoms(symptoms, userAnswers)
        setAnalysisResult(result)

        // Save to database
        try {
            const logData = {
                symptoms: [symptoms],
                follow_up_answers: { questions, answers: userAnswers },
                risk_level: result.riskLevel,
                ai_analysis: result
            }

            if (isGuest) {
                const guestData = JSON.parse(localStorage.getItem('healthguard_guest_data') || '{}')
                guestData.symptomLogs = [
                    ...(guestData.symptomLogs || []),
                    { ...logData, id: Date.now(), recorded_at: new Date().toISOString() }
                ]
                localStorage.setItem('healthguard_guest_data', JSON.stringify(guestData))
            } else if (user) {
                await addSymptomLog(user.id, logData)
            }
        } catch (error) {
            console.error('Error saving symptom log:', error)
        }

        setLoading(false)
    }

    const resetAssistant = () => {
        setStep('input')
        setSymptoms('')
        setQuestions([])
        setAnswers([])
        setCurrentAnswer('')
        setCurrentQuestionIndex(0)
        setAnalysisResult(null)
    }

    const getRiskBadge = (level) => {
        switch (level) {
            case 'low':
                return (
                    <span className="badge-low flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mức độ thấp
                    </span>
                )
            case 'medium':
                return (
                    <span className="badge-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Mức độ trung bình
                    </span>
                )
            case 'high':
                return (
                    <span className="badge-high flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Mức độ cao
                    </span>
                )
            default:
                return null
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Trợ lý phân tích triệu chứng</h1>
                        <p className="text-dark-400">AI hỗ trợ đánh giá mức độ rủi ro sức khỏe</p>
                    </div>
                </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="glass-card p-4 border-warning-500/30 bg-warning-500/5">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-dark-300">
                        <strong className="text-warning-400">Lưu ý quan trọng:</strong> Công cụ này chỉ đưa ra
                        đánh giá sơ bộ dựa trên thông tin bạn cung cấp. Đây KHÔNG phải chẩn đoán y khoa.
                        Luôn tham khảo ý kiến bác sĩ khi cần.
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="glass-card p-6">
                {/* Step 1: Input Symptoms */}
                {step === 'input' && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="glass-card p-4 flex-1">
                                <p className="text-dark-200">
                                    Xin chào! Tôi là trợ lý sức khỏe AI. Hãy mô tả các triệu chứng bạn đang gặp phải,
                                    tôi sẽ đặt một vài câu hỏi để hiểu rõ hơn và đưa ra đánh giá sơ bộ.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSymptomSubmit} className="flex gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    className="input-field min-h-[100px] pr-12"
                                    placeholder="VD: Tôi bị đau đầu và sốt nhẹ từ sáng nay, kèm theo mệt mỏi..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary self-end"
                                disabled={!symptoms.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Follow-up Questions */}
                {step === 'questions' && (
                    <div className="space-y-4">
                        {/* User's initial symptom */}
                        <div className="flex items-start gap-3 justify-end">
                            <div className="glass-card p-4 bg-primary-500/10 border-primary-500/30 max-w-md">
                                <p className="text-dark-200">{symptoms}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Previous Q&A */}
                        {answers.map((answer, index) => (
                            <div key={index} className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="glass-card p-4">
                                        <p className="text-dark-200">{questions[index]}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="glass-card p-4 bg-primary-500/10 border-primary-500/30 max-w-md">
                                        <p className="text-dark-200">{answer}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Current Question */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="glass-card p-4">
                                <p className="text-dark-200">{questions[currentQuestionIndex]}</p>
                            </div>
                        </div>

                        {/* Answer Input */}
                        <form onSubmit={handleAnswerSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                className="input-field flex-1"
                                placeholder="Nhập câu trả lời của bạn..."
                                required
                                autoFocus
                            />
                            <button type="submit" className="btn-primary">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="text-center text-sm text-dark-500">
                            Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                        </div>
                    </div>
                )}

                {/* Step 3: Analysis Result */}
                {step === 'result' && (
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                                <p className="text-dark-400">Đang phân tích triệu chứng...</p>
                            </div>
                        ) : analysisResult && (
                            <>
                                {/* Risk Level */}
                                <div className="text-center">
                                    <div className="mb-4">
                                        {getRiskBadge(analysisResult.riskLevel)}
                                    </div>

                                    {analysisResult.warnings.length > 0 && (
                                        <div className="p-4 bg-danger-500/10 border border-danger-500/30 rounded-xl mb-4">
                                            {analysisResult.warnings.map((warning, i) => (
                                                <p key={i} className="text-danger-400 text-sm">{warning}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Possible Conditions */}
                                {analysisResult.possibleConditions.length > 0 && (
                                    <div className="glass-card p-4">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Stethoscope className="w-5 h-5 text-purple-400" />
                                            Tình trạng có thể (tham khảo)
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysisResult.possibleConditions.map((condition, i) => (
                                                <li key={i} className="text-dark-300 text-sm flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                                    {condition}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Medication Groups */}
                                {analysisResult.medicationGroups.length > 0 && (
                                    <div className="glass-card p-4">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Pill className="w-5 h-5 text-primary-400" />
                                            Nhóm thuốc OTC có thể tham khảo
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysisResult.medicationGroups.map((med, i) => (
                                                <li key={i} className="text-dark-300 text-sm flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                                                    {med}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-dark-500 mt-3">
                                            ⚠️ Luôn đọc kỹ hướng dẫn sử dụng và tham khảo ý kiến dược sĩ
                                        </p>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {analysisResult.recommendations.length > 0 && (
                                    <div className="glass-card p-4 bg-success-500/5 border-success-500/20">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-success-400" />
                                            Lời khuyên
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysisResult.recommendations.map((rec, i) => (
                                                <li key={i} className="text-dark-300 text-sm flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-success-400"></span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* When to See Doctor */}
                                {analysisResult.whenToSeeDoctor.length > 0 && (
                                    <div className="glass-card p-4 bg-warning-500/5 border-warning-500/20">
                                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                            <Hospital className="w-5 h-5 text-warning-400" />
                                            Khi nào cần gặp bác sĩ
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysisResult.whenToSeeDoctor.map((when, i) => (
                                                <li key={i} className="text-dark-300 text-sm flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-warning-400 flex-shrink-0" />
                                                    {when}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Reset Button */}
                                <button
                                    onClick={resetAssistant}
                                    className="btn-secondary w-full flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Phân tích triệu chứng mới
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
