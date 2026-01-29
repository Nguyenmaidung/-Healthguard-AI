import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
    LayoutDashboard,
    User,
    Activity,
    Scale,
    Stethoscope,
    Pill,
    LogOut,
    Menu,
    X,
    Heart,
    ChevronRight
} from 'lucide-react'

const navItems = [
    { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/profile', label: 'Hồ sơ sức khỏe', icon: User },
    { path: '/tracking', label: 'Theo dõi hàng ngày', icon: Activity },
    { path: '/bmi', label: 'BMI & Cân nặng', icon: Scale },
    { path: '/symptoms', label: 'Phân tích triệu chứng', icon: Stethoscope },
    { path: '/medication', label: 'Tra cứu thuốc', icon: Pill },
]

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const { signOut, user, isGuest } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-72 
          bg-dark-900/95 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">HealthGuard</h1>
                            <p className="text-xs text-primary-400">AI Assistant</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-dark-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-white border border-primary-500/30'
                                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User info & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {isGuest ? 'Khách' : (user?.email || 'Người dùng')}
                            </p>
                            <p className="text-xs text-dark-400">
                                {isGuest ? 'Chế độ dùng thử' : 'Tài khoản đã xác thực'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                       text-dark-300 hover:text-danger-400 hover:bg-danger-500/10
                       transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-dark-300 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Page title - dynamic based on route */}
                        <h2 className="text-lg font-semibold text-white hidden lg:block">
                            {navItems.find(item => item.path === location.pathname)?.label || 'HealthGuard AI'}
                        </h2>

                        {/* Medical Disclaimer badge */}
                        <div className="flex items-center gap-2 text-xs text-warning-400 bg-warning-500/10 px-3 py-1.5 rounded-full border border-warning-500/20">
                            <span>⚠️</span>
                            <span className="hidden sm:inline">Chỉ mang tính chất tham khảo</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>

                {/* Footer disclaimer */}
                <footer className="px-4 lg:px-8 py-6 border-t border-white/10">
                    <p className="text-xs text-dark-500 text-center">
                        ⚠️ Ứng dụng này không thay thế bác sĩ. Thông tin chỉ mang tính chất tham khảo.
                        Luôn tham khảo ý kiến chuyên gia y tế khi cần.
                    </p>
                </footer>
            </div>
        </div>
    )
}
