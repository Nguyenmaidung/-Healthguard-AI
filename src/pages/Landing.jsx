import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
    Heart,
    Activity,
    Shield,
    Stethoscope,
    Scale,
    Pill,
    ArrowRight,
    Check,
    AlertTriangle
} from 'lucide-react'

const features = [
    {
        icon: Activity,
        title: 'Theo dõi sức khỏe hàng ngày',
        description: 'Ghi nhận nhiệt độ, nhịp tim, huyết áp, giấc ngủ và hoạt động thể chất mỗi ngày.'
    },
    {
        icon: Scale,
        title: 'Quản lý BMI & Cân nặng',
        description: 'Tính toán BMI tự động, theo dõi xu hướng cân nặng với biểu đồ trực quan.'
    },
    {
        icon: Stethoscope,
        title: 'Phân tích triệu chứng AI',
        description: 'Nhập triệu chứng, AI đặt câu hỏi và đánh giá mức độ rủi ro sức khỏe.'
    },
    {
        icon: Pill,
        title: 'Tra cứu thuốc OTC',
        description: 'Tìm hiểu thông tin thuốc không kê đơn, cảnh báo tương tác và tác dụng phụ.'
    },
    {
        icon: Shield,
        title: 'Bảo mật dữ liệu',
        description: 'Dữ liệu được mã hóa và bảo vệ. Bạn hoàn toàn kiểm soát thông tin của mình.'
    },
    {
        icon: Heart,
        title: 'Phát hiện sớm rủi ro',
        description: 'Cảnh báo sớm các nguy cơ sức khỏe như tiểu đường, cao huyết áp, stress.'
    }
]

export default function Landing() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">HealthGuard AI</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                                    Vào Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-dark-300 hover:text-white transition-colors">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="btn-primary flex items-center gap-2">
                                        Bắt đầu ngay
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full border border-primary-500/20 mb-6">
                        <Heart className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-primary-400">Trợ lý sức khỏe thông minh</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Chăm sóc sức khỏe</span>
                        <br />
                        <span className="gradient-text">cùng trí tuệ nhân tạo</span>
                    </h1>

                    <p className="text-lg text-dark-300 mb-8 max-w-2xl mx-auto">
                        HealthGuard AI giúp bạn theo dõi sức khỏe hàng ngày, phát hiện sớm nguy cơ
                        và nhận tư vấn an toàn về triệu chứng và thuốc OTC.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                            Đăng ký miễn phí
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                            Đã có tài khoản
                        </Link>
                    </div>
                </div>
            </section>

            {/* Disclaimer Banner */}
            <section className="py-6 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-6 border-warning-500/30 bg-warning-500/5">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-warning-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-warning-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-warning-400 mb-2">
                                    Thông báo quan trọng
                                </h3>
                                <ul className="text-sm text-dark-300 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <span className="text-danger-400">✗</span>
                                        Ứng dụng KHÔNG thay thế bác sĩ
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-danger-400">✗</span>
                                        Ứng dụng KHÔNG kê đơn thuốc
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-danger-400">✗</span>
                                        Ứng dụng KHÔNG đưa ra liều lượng
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-success-400">✓</span>
                                        CHỈ đánh giá mức độ rủi ro và đưa ra lời khuyên tham khảo
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Tính năng chính</h2>
                        <p className="text-dark-400">Công cụ toàn diện để theo dõi và bảo vệ sức khỏe của bạn</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="glass-card-hover p-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 
                                  flex items-center justify-center mb-4 border border-primary-500/30">
                                        <Icon className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-dark-400 text-sm">{feature.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Bắt đầu theo dõi sức khỏe ngay hôm nay
                            </h2>
                            <p className="text-dark-300 mb-8">
                                Đăng ký miễn phí và khám phá cách HealthGuard AI có thể giúp bạn
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/register" className="btn-primary flex items-center gap-2">
                                    Tạo tài khoản miễn phí
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-dark-500 text-sm">
                        © 2026 HealthGuard AI. Thông tin trong ứng dụng chỉ mang tính chất tham khảo.
                    </p>
                </div>
            </footer>
        </div>
    )
}
