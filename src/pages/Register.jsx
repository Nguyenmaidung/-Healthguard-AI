import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, Mail, Lock, User, AlertCircle, Loader2, Check } from 'lucide-react'

export default function Register() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptDisclaimer, setAcceptDisclaimer] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const validatePassword = (pass) => {
        if (pass.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự'
        }
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validations
        if (!acceptDisclaimer) {
            setError('Bạn cần đồng ý với tuyên bố từ chối trách nhiệm y tế')
            return
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        const passwordError = validatePassword(password)
        if (passwordError) {
            setError(passwordError)
            return
        }

        setLoading(true)

        try {
            await signUp(email, password, fullName)
            setSuccess(true)
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="glass-card p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center">
                            <Check className="w-8 h-8 text-success-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Đăng ký thành công!</h2>
                        <p className="text-dark-400 mb-6">
                            Vui lòng kiểm tra email để xác nhận tài khoản của bạn.
                        </p>
                        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">HealthGuard AI</span>
                    </Link>
                </div>

                {/* Register Card */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white text-center mb-2">Tạo tài khoản</h2>
                    <p className="text-dark-400 text-center mb-6">Bắt đầu theo dõi sức khỏe của bạn</p>

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 bg-danger-500/10 border border-danger-500/30 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0" />
                            <p className="text-sm text-danger-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="Tối thiểu 6 ký tự"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                />
                            </div>
                        </div>

                        {/* Medical Disclaimer */}
                        <div className="p-4 bg-warning-500/10 border border-warning-500/30 rounded-xl">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptDisclaimer}
                                    onChange={(e) => setAcceptDisclaimer(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-dark-500 bg-dark-800 
                             text-primary-500 focus:ring-primary-500/50"
                                />
                                <span className="text-sm text-dark-300">
                                    Tôi hiểu rằng ứng dụng này <strong className="text-warning-400">không thay thế bác sĩ</strong>,
                                    không kê đơn thuốc, không đưa ra liều lượng. Tất cả thông tin
                                    chỉ mang tính chất tham khảo.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-dark-400">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )
}
